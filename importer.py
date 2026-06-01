import pandas as pd
import json
import os
from groq import Groq
from dotenv import load_dotenv
from database import get_db, init_db
from datetime import datetime

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

KNOWN_FIELDS = {
    "company_name": ["company", "client", "organization", "account", "business", "firm", "company name", "client name"],
    "industry": ["industry", "sector", "vertical", "business type"],
    "country": ["country", "region", "location", "territory"],
    "contact_name": ["contact", "person", "rep", "contact name", "person of contact", "point of contact"],
    "contact_role": ["role", "title", "position", "job title"],
    "contact_email": ["email", "email address", "e-mail"],
    "contact_phone": ["phone", "telephone", "mobile", "cell"],
    "software": ["software", "product", "solution", "service", "tool"],
    "vendor": ["vendor", "supplier", "manufacturer", "provider", "partner"],
    "expiry_date": ["expiry", "expiration", "renewal", "end date", "contract end", "renewal date", "expected date"],
    "start_date": ["start", "start date", "contract start", "begin date"],
    "contract_value": ["value", "amount", "price", "revenue", "deal value", "contract value", "arr", "mrr", "$"],
    "assigned_to": ["assigned", "owner", "rep", "account manager", "sales rep", "team member", "responsible"],
    "last_contact": ["last contact", "last call", "last touch", "last interaction", "last meeting"],
    "status": ["status", "stage", "state"],
    "notes": ["notes", "comments", "description", "remarks"],
}

def ai_map_columns(columns, sample_rows):
    """Use Groq to intelligently map Excel columns to our database fields"""
    
    sample_str = "\n".join([str(row) for row in sample_rows[:3]])
    
    prompt = f"""You are a data mapping expert. Map these Excel columns to CRM database fields.

Excel columns: {columns}

Sample data rows:
{sample_str}

Available database fields:
- company_name: the company/client name
- industry: business sector
- country: location/country
- contact_name: person of contact name
- contact_role: their job title/role
- contact_email: their email
- contact_phone: their phone number
- software: software/product sold
- vendor: software vendor/supplier
- expiry_date: contract expiry/renewal date
- start_date: contract start date
- contract_value: monetary value of contract
- assigned_to: team member responsible
- last_contact: date of last contact/interaction
- status: current status of account
- notes: any notes or comments
- ignore: column is not relevant

Respond ONLY with a valid JSON object mapping each column to a field.
Example: {{"Company Name": "company_name", "Phone": "contact_phone", "Internal ID": "ignore"}}

JSON:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )
    
    text = response.choices[0].message.content.strip()
    # Clean up response
    if "```" in text:
        text = text.split("```")[1].replace("json", "").strip()
    
    try:
        mapping = json.loads(text)
        return mapping
    except:
        return {}

def import_file(filepath):
    """Import CSV or Excel file into database"""
    
    # Read file
    if filepath.endswith('.csv'):
        df = pd.read_csv(filepath)
    else:
        df = pd.read_excel(filepath)
    
    columns = list(df.columns)
    sample_rows = df.head(3).to_dict('records')
    
    print(f"Found columns: {columns}")
    print("Asking AI to map columns...")
    
    # Get AI mapping
    mapping = ai_map_columns(columns, sample_rows)
    print(f"AI mapping: {mapping}")
    
    # Initialize db
    init_db()
    conn = get_db()
    c = conn.cursor()
    
    imported = 0
    
    for _, row in df.iterrows():
        # Extract mapped fields
        data = {}
        extra = {}
        
        for col, field in mapping.items():
            if col in row and field != "ignore":
                data[field] = row[col]
            elif col in row and field == "ignore":
                pass
            elif col in row:
                extra[col] = row[col]
        
        # Insert client
        company = data.get("company_name", "Unknown")
        
        # Check if client already exists
        c.execute("SELECT id FROM clients WHERE company_name = ?", (company,))
        existing = c.fetchone()
        
        if existing:
            client_id = existing[0]
        else:
            c.execute("""
                INSERT INTO clients (company_name, industry, country)
                VALUES (?, ?, ?)
            """, (
                company,
                data.get("industry"),
                data.get("country")
            ))
            client_id = c.lastrowid
        
        # Insert contact if we have one
        if data.get("contact_name"):
            c.execute("""
                INSERT INTO contacts (client_id, name, role, email, phone, is_primary)
                VALUES (?, ?, ?, ?, ?, 1)
            """, (
                client_id,
                data.get("contact_name"),
                data.get("contact_role"),
                data.get("contact_email"),
                data.get("contact_phone")
            ))
        
        # Insert contract if we have expiry date
        if data.get("expiry_date") or data.get("software"):
            c.execute("""
                INSERT INTO contracts (client_id, software, vendor, start_date, expiry_date, value, assigned_to, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                client_id,
                data.get("software"),
                data.get("vendor"),
                data.get("start_date"),
                data.get("expiry_date"),
                data.get("contract_value"),
                data.get("assigned_to"),
                data.get("status", "active")
            ))
        
        # Store extra fields
        for field_name, field_value in extra.items():
            c.execute("""
                INSERT INTO extra_fields (client_id, field_name, field_value)
                VALUES (?, ?, ?)
            """, (client_id, field_name, str(field_value)))
        
        imported += 1
    
    conn.commit()
    conn.close()
    
    print(f"✅ Imported {imported} records successfully!")
    return {"imported": imported, "mapping": mapping}

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        result = import_file(sys.argv[1])
        print(result)
    else:
        print("Usage: python3 importer.py <filepath>")

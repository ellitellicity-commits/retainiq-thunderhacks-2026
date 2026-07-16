import sqlite3
import os
import csv
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "retainiq.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    # Clients table — companies
    c.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            industry TEXT,
            country TEXT,
            website TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Contacts table — people within companies
    c.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            role TEXT,
            email TEXT,
            phone TEXT,
            is_primary INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    ''')

    # Client contacts table (used by UI)
    c.execute('''
        CREATE TABLE IF NOT EXISTS client_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            name TEXT,
            title TEXT,
            email TEXT,
            phone TEXT,
            is_primary INTEGER DEFAULT 0,
            created_at TEXT
        )
    ''')

    # Contracts table — software licenses
    c.execute('''
        CREATE TABLE IF NOT EXISTS contracts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            software TEXT,
            vendor TEXT,
            start_date TEXT,
            expiry_date TEXT,
            value REAL,
            status TEXT DEFAULT 'active',
            assigned_to TEXT,
            last_contact TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    ''')

    # Deals table — ongoing proposals
    c.execute('''
        CREATE TABLE IF NOT EXISTS deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            title TEXT,
            value REAL,
            stage TEXT DEFAULT 'prospecting',
            expected_close TEXT,
            assigned_to TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    ''')

    # Activities table — calls, emails, meetings
    c.execute('''
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            type TEXT,
            notes TEXT,
            date TEXT,
            done_by TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    ''')

    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Pipeline deals table (used by UI)
    c.execute('''
        CREATE TABLE IF NOT EXISTS pipeline_deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT,
            client_id INTEGER,
            value REAL,
            stage TEXT,
            owner TEXT,
            next_action TEXT,
            next_action_date TEXT,
            lead_source TEXT,
            product TEXT,
            stage_updated_at TEXT,
            created_at TEXT,
            status TEXT DEFAULT 'open',
            expected_close_date TEXT,
            quote_discount REAL,
            quote_status TEXT
        )
    ''')

    # Quote items table
    c.execute('''
        CREATE TABLE IF NOT EXISTS quote_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deal_id INTEGER,
            description TEXT,
            quantity INTEGER DEFAULT 1,
            unit_price REAL,
            sort_order INTEGER DEFAULT 0
        )
    ''')

    # Extra fields table — for any custom columns from their Excel
    c.execute('''
        CREATE TABLE IF NOT EXISTS extra_fields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            field_name TEXT NOT NULL,
            field_value TEXT,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    ''')

    # Column mappings — save their Excel mappings for next time
    c.execute('''
        CREATE TABLE IF NOT EXISTS column_mappings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_column TEXT NOT NULL,
            mapped_to TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("Database initialized successfully!")
    
# New Seeding Function Implementation
CSV_PATH = os.path.join(BASE_DIR, "clients.csv")

def _to_float(v):
    try:
        return float(str(v).replace(",", "").replace("$", "").strip())
    except (TypeError, ValueError):
        return None

def seed_if_empty():
    """Load demo data from clients.csv if the database is empty.
    Needed because Render's free tier wipes the disk on every boot,
    so the DB starts empty and no import is ever run in production."""
    conn = get_db()
    c = conn.cursor()

    count = c.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
    if count > 0:
        conn.close()
        return

    if not os.path.exists(CSV_PATH):
        print("Warning: clients.csv not found -- skipping demo seed.")
        conn.close()
        return

    rows = 0
    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            company = (row.get("client_name") or "").strip()
            if not company:
                continue
            c.execute("INSERT INTO clients (company_name) VALUES (?)", (company,))
            client_id = c.lastrowid
            c.execute(
                """INSERT INTO contracts
                   (client_id, software, vendor, start_date, expiry_date,
                    value, assigned_to, status, last_contact)
                   VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)""",
                (
                    client_id,
                    (row.get("software") or "").strip() or None,
                    (row.get("vendor") or "").strip() or None,
                    (row.get("contract_start") or "").strip() or None,
                    (row.get("contract_expiry") or "").strip() or None,
                    _to_float(row.get("contract_value")),
                    (row.get("account_manager") or "").strip() or None,
                    (row.get("last_contact") or "").strip() or None,
                ),
            )
            rows += 1

    # Seed demo contacts and deals from demo_data.json
    demo_json_path = os.path.join(BASE_DIR, "demo_data.json")
    if os.path.exists(demo_json_path):
        with open(demo_json_path, encoding="utf-8") as f:
            demo = json.load(f)
        for ct in demo.get("contacts", []):
            c.execute(
                """INSERT INTO client_contacts (client_id, name, title, email, phone, is_primary)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (ct["client_id"], ct["name"], ct["title"], ct["email"], ct["phone"], ct["is_primary"])
            )
        for deal in demo.get("deals", []):
            c.execute(
                """INSERT INTO pipeline_deals (company, client_id, value, stage, owner, product, lead_source, status, created_at, stage_updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, 'open', '2026-07-01', '2026-07-10')""",
                (deal["company"], deal["client_id"], deal["value"], deal["stage"], deal["owner"], deal["product"], deal["lead_source"])
            )

    conn.commit()
    conn.close()
    print(f"Seeded {rows} demo clients from clients.csv")

if __name__ == "__main__":
    init_db()
    seed_if_empty()

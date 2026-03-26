import pandas as pd
from datetime import datetime
import numpy as np

_df = None

def load_and_train(csv_path="clients.csv"):
    global _df
    df = pd.read_csv(csv_path)
    
    today = datetime.today()
    
    # Calculate days until contract expiry
    df["contract_expiry"] = pd.to_datetime(df["contract_expiry"])
    df["contract_start"] = pd.to_datetime(df["contract_start"])
    df["last_contact"] = pd.to_datetime(df["last_contact"])
    
    df["days_until_expiry"] = (df["contract_expiry"] - today).dt.days
    df["days_since_contact"] = (today - df["last_contact"]).dt.days
    
    # Risk score based on expiry and contact
    def calculate_risk(row):
        score = 0
        
        # Contract expiry risk (most important)
        if row["days_until_expiry"] < 0:
            score += 80  # already expired
        elif row["days_until_expiry"] <= 30:
            score += 70  # critical
        elif row["days_until_expiry"] <= 60:
            score += 50  # high
        elif row["days_until_expiry"] <= 90:
            score += 30  # medium
        else:
            score += 5   # low
        
        # Last contact risk
        if row["days_since_contact"] > 90:
            score += 20
        elif row["days_since_contact"] > 60:
            score += 10
        elif row["days_since_contact"] > 30:
            score += 5
        
        return min(100, round(score, 1))
    
    df["churn_risk_score"] = df.apply(calculate_risk, axis=1)
    
    # Journey stage based on days until expiry
    def assign_stage(row):
        if row["days_until_expiry"] < 0:
            return "Expired"
        elif row["days_until_expiry"] <= 30:
            return "Critical"
        elif row["days_until_expiry"] <= 90:
            return "At-Risk"
        else:
            return "Active"
    
    df["journey_stage"] = df.apply(assign_stage, axis=1)
    
    # Format dates back to strings for JSON
    df["contract_expiry"] = df["contract_expiry"].dt.strftime("%Y-%m-%d")
    df["contract_start"] = df["contract_start"].dt.strftime("%Y-%m-%d")
    df["last_contact"] = df["last_contact"].dt.strftime("%Y-%m-%d")
    
    _df = df
    return df

def get_dataframe():
    return _df

def score_new_customer(features: dict):
    today = datetime.today()
    expiry = datetime.strptime(features.get("contract_expiry", str(today)), "%Y-%m-%d")
    days_until_expiry = (expiry - today).days
    days_since_contact = features.get("days_since_contact", 0)
    
    score = 0
    if days_until_expiry < 0:
        score += 80
    elif days_until_expiry <= 30:
        score += 70
    elif days_until_expiry <= 60:
        score += 50
    elif days_until_expiry <= 90:
        score += 30
    else:
        score += 5
    
    if days_since_contact > 90:
        score += 20
    elif days_since_contact > 60:
        score += 10
    elif days_since_contact > 30:
        score += 5
    
    return min(100, round(score, 1))

def _assign_stage(score):
    if score >= 80:
        return "Expired"
    elif score >= 50:
        return "Critical"
    elif score >= 30:
        return "At-Risk"
    else:
        return "Active"

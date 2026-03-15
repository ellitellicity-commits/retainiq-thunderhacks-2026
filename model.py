import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import numpy as np

FEATURES = ["spend", "logins", "days_since_contact", "support_tickets", "contract_months"]

_model = None
_scaler = None
_df = None

def load_and_train(csv_path="customers.csv"):
    global _model, _scaler, _df
    df = pd.read_csv(csv_path)
    df[FEATURES] = df[FEATURES].fillna(df[FEATURES].median())
    df["churned"] = df["churned"].fillna(0).astype(int)
    X = df[FEATURES]
    y = df["churned"]
    _scaler = StandardScaler()
    X_scaled = _scaler.fit_transform(X)
    _model = LogisticRegression(max_iter=1000, random_state=42)
    _model.fit(X_scaled, y)
    churn_probs = _model.predict_proba(X_scaled)[:, 1]
    df["churn_risk_score"] = (churn_probs * 100).round(1)
    df["journey_stage"] = df["churn_risk_score"].apply(_assign_stage)
    _df = df
    return df

def _assign_stage(score):
    if score < 20:
        return "Onboarded"
    elif score < 45:
        return "Active"
    elif score < 70:
        return "At-Risk"
    else:
        return "Churned"

def get_dataframe():
    return _df

def score_new_customer(features: dict):
    if _model is None or _scaler is None:
        raise RuntimeError("Model not trained yet.")
    row = pd.DataFrame([{f: features.get(f, 0) for f in FEATURES}])
    row_scaled = _scaler.transform(row)
    prob = _model.predict_proba(row_scaled)[0][1]
    return round(prob * 100, 1)

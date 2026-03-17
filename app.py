import os
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from model import load_and_train, get_dataframe, score_new_customer, _assign_stage

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "customers.csv")
load_and_train(CSV_PATH)
print("✅ Model trained and data loaded.")


def generate_template_email(name, plan, spend, days_no_contact, risk_score):
    first_name = name.split()[0] if name else "Customer"

    senders = ["Sarah", "James", "Priya", "Marcus", "Elena", "David"]
    sender = random.choice(senders)

    titles = [
        "Customer Success Manager",
        "Account Manager",
        "Client Relations Specialist",
        "Customer Experience Lead",
    ]
    title = random.choice(titles)

    openers = [
        "I hope you're having a great week so far!",
        "I was just thinking about our customers and wanted to personally reach out.",
        "Quick note from me — I wanted to check in and see how things are going on your end.",
        "I noticed it's been a little while since we last connected and wanted to say hi.",
        "Hope things are going well! I wanted to take a moment to reach out personally.",
        "Just dropping a quick note to check in — we really value having you with us.",
    ]

    if days_no_contact > 30:
        opener = random.choice([
            "I realized it's been a while since we last touched base, and I didn't want too much more time to pass without checking in.",
            "I noticed we haven't connected in a bit — I hope everything has been going smoothly on your end!",
            f"Time flies! I can't believe it's been {days_no_contact} days since we last spoke. I wanted to reach out personally.",
        ])
    else:
        opener = random.choice(openers)

    if spend < 100:
        offers = [
            f"I'd love to walk you through some of the newer features on your {plan} plan that you might not have had a chance to explore yet.",
            "I think there might be a better fit for what you're trying to accomplish — would love to chat about your options.",
            "We've recently added some great new features that I think could make a real difference for you.",
        ]
    elif plan == "Enterprise":
        offers = [
            "As one of our Enterprise customers, I want to make sure you're getting the absolute most out of everything available to you.",
            "I wanted to personally check that your team has everything they need and that we're meeting your expectations.",
            "Your success is really important to us — I'd love to hear how things have been going and if there's anything we can improve.",
        ]
    else:
        offers = [
            f"I wanted to make sure you're getting the most out of your {plan} plan and that everything is running smoothly.",
            "We've been rolling out some improvements lately and I wanted to make sure you're aware of everything available to you.",
            "I'd love to hear how things have been going — your feedback really helps us improve.",
        ]
    offer = random.choice(offers)

    if risk_score > 85:
        ctas = [
            "Would you have 15 minutes this week for a quick call? I'd love to connect.",
            "If you ever have questions or concerns, please don't hesitate to reach out — I'm always happy to help.",
            "Could we find 10-15 minutes to catch up? I'd really value hearing your thoughts.",
        ]
    else:
        ctas = [
            "Feel free to reply here or book a quick call whenever works for you!",
            "My calendar is open — happy to jump on a call at your convenience.",
            "Don't hesitate to reach out anytime — I'm here whenever you need me.",
        ]
    cta = random.choice(ctas)

    closings = [
        "Looking forward to hearing from you!",
        "Hope to connect soon!",
        "Talk soon!",
        "Warmly,",
        "Best wishes,",
    ]
    closing = random.choice(closings)

    subjects = [
        f"Checking in, {first_name} — how's everything going?",
        f"Hey {first_name}, just wanted to touch base!",
        f"A quick note for you, {first_name}",
        f"{first_name} — how are things with Digital Move?",
        f"Thinking of you, {first_name} — let's catch up!",
    ]
    subject = random.choice(subjects)

    extras = [
        "\nWe've also got some exciting updates coming up that I think you'll really like — happy to share more on a call.",
        f"\nAs a valued {plan} customer, there may also be some exclusive options available to you that I'd love to walk you through.",
        "",
        "",
        "",
    ]
    extra = random.choice(extras)

    body = (
        f"Hi {first_name},\n\n"
        f"{opener}\n\n"
        f"{offer}{extra}\n\n"
        f"{cta}\n\n"
        f"{closing}\n"
        f"{sender}\n"
        f"{title}\n"
        f"Digital Move IT & Telecom"
    )

    return subject, body


@app.route("/")
def home():
    return "RetainIQ backend is running"


@app.route("/api/ping")
def ping():
    return jsonify({"status": "ok"})


@app.route("/api/customers")
def get_customers():
    df = get_dataframe()
    sort_by = request.args.get("sort", "churn_risk_score")
    order = request.args.get("order", "desc")
    stage = request.args.get("stage", None)

    if sort_by not in df.columns:
        sort_by = "churn_risk_score"

    result = df.sort_values(sort_by, ascending=(order == "asc"))

    if stage and "journey_stage" in result.columns:
        result = result[result["journey_stage"] == stage]

    return jsonify(result.to_dict(orient="records"))


@app.route("/api/customers/<int:customer_id>")
def get_customer(customer_id):
    df = get_dataframe()
    row = df[df["id"] == customer_id]
    if row.empty:
        return jsonify({"error": "Customer not found"}), 404
    return jsonify(row.iloc[0].to_dict())


@app.route("/api/stats")
def get_stats():
    df = get_dataframe()
    by_stage = df.groupby("journey_stage").size().to_dict()
    by_plan = (
        df.groupby("plan")
        .agg(count=("id", "count"), avg_score=("churn_risk_score", "mean"))
        .round(1)
        .reset_index()
        .to_dict(orient="records")
    )

    return jsonify({
        "total_customers": int(len(df)),
        "avg_risk_score": round(float(df["churn_risk_score"].mean()), 1),
        "high_risk_count": int((df["churn_risk_score"] > 70).sum()),
        "medium_risk_count": int(((df["churn_risk_score"] >= 40) & (df["churn_risk_score"] <= 70)).sum()),
        "low_risk_count": int((df["churn_risk_score"] < 40).sum()),
        "by_stage": by_stage,
        "by_plan": by_plan,
    })


@app.route("/api/alerts")
def get_alerts():
    df = get_dataframe()
    alerts = df[df["churn_risk_score"] > 70].sort_values("churn_risk_score", ascending=False)
    return jsonify({
        "count": int(len(alerts)),
        "customers": alerts.to_dict(orient="records"),
    })


@app.route("/api/journey")
def get_journey():
    df = get_dataframe()
    stages = ["Onboarded", "Active", "At-Risk", "Churned"]
    result = []

    for stage in stages:
        stage_df = df[df["journey_stage"] == stage]
        result.append({
            "stage": stage,
            "count": int(len(stage_df)),
            "customers": stage_df[["id", "name", "plan", "churn_risk_score"]].to_dict(orient="records"),
        })

    return jsonify(result)


@app.route("/api/email", methods=["POST"])
def generate_email():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("customer_name") or data.get("name", "Valued Customer")
    risk_score = data.get("risk_score") or data.get("churn_risk_score", 75)
    plan = data.get("plan", "Standard")
    spend = data.get("spend") or data.get("monthly_spend", 0)
    days_no_contact = data.get("days_since_contact") or data.get("days_since_last_contact", 30)

    subject, body = generate_template_email(name, plan, spend, days_no_contact, risk_score)

    return jsonify({
        "customer_name": name,
        "subject": subject,
        "body": body,
    })


@app.route("/api/score", methods=["POST"])
def score_customer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        score = score_new_customer(data)
        return jsonify({
            "churn_risk_score": score,
            "journey_stage": _assign_stage(score),
            "risk_level": "High" if score > 70 else ("Medium" if score >= 40 else "Low"),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/render-test")
def render_test():
    return jsonify({"message": "new backend file is live"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

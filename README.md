<div align="center">

# RetainIQ

**Predict churn. Act early. Retain more.**

*Built in 24 hours at ThunderHacks 2026 (Prototype)*

---

</div>

## Overview

RetainIQ gives Digital Move IT & Telecom a single place to see which customers are drifting away — before they actually leave. It combines a machine learning churn model, a real-time alert system, and an AI email generator into one clean, fast dashboard.

No more reactive sales calls after a customer has already gone quiet. RetainIQ surfaces the signal early.

---

## What it does

**Dashboard**
A live overview of your entire customer base. Churn risk scores visualized across every account, filterable by plan and risk level. Click any customer to pull up their full profile inline.

**Customer Intelligence**
A sortable, searchable table with sparkline trend charts, animated risk bars, and expandable detail panels. Every data point you need, none you don't.

**Journey Map**
Four stages — Onboarded, Active, At-Risk, Churned — rendered as a visual pipeline. Click into any stage to see exactly who's there and why.

**Lifecycle**
A scrollable, animated narrative for every customer. Watch their profile card morph from healthy to critical as you scroll through the story of their engagement decline.

**Alert Center**
The customers who need a call today. A terminal-style AI panel drafts a unique, personalized retention email for each one — new copy every time you generate.

---

## Under the hood

Machine learning model trained on customer spend, login frequency, days since last contact, support ticket volume, and contract length. Outputs a churn probability score from 0 to 100 for every account.

The email generator draws from a pool of sender personas, opening lines, value propositions, and calls-to-action — assembled dynamically so no two emails read the same.

---

## Stack

| | |
|---|---|
| Frontend | React · Framer Motion · Recharts |
| Backend | Python · Flask |
| Intelligence | scikit-learn · Pandas |
| Design | Space Mono · DM Sans · CSS Variables |

---

## Running it locally
```bash
# Backend
cd hackathon
pip install flask flask-cors pandas scikit-learn numpy
python3 app.py

# Frontend
cd hackathon/frontend
npm install && npm start
```

---

## Built for

**ThunderHacks 2026** — The Frictionless Campus
Digital Move IT & Telecom · Gold Sponsor Challenge

Addresses all four required pillars — predictive churn scoring, automated outreach drafts, customer journey mapping, and real-time alerts.

---

## Team

**Ellison Naz** · **Rishav Bawa**

*Algoma University · March 2026*

---

<div align="center">
<sub>Built with focus and very little sleep.</sub>
</div>

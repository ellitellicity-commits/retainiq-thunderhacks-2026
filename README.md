<div align="center">

<br />

<img src="https://img.shields.io/badge/ThunderHacks_2026-Algoma_University-00e5ff?style=for-the-badge&labelColor=0a0f1e" />
&nbsp;
<img src="https://img.shields.io/badge/Digital_Move-Gold_Sponsor_Challenge-f59e0b?style=for-the-badge&labelColor=0a0f1e" />

<br />
<br />

# ⚡ RetainIQ

### Know who's leaving. Reach them first.

<br />

**[Live Demo](https://retainiq-thunderhacks-2026.vercel.app)** · **[GitHub](https://github.com/ellitellicity-commits/retainiq-thunderhacks-2026)**

<br />

---

</div>

<br />

RetainIQ is a customer retention intelligence platform built for **Digital Move IT & Telecom** in 24 hours at ThunderHacks 2026. It watches your entire customer base in real time — scoring churn risk, mapping customer journeys, and drafting personalized outreach — so your sales team stops reacting and starts preventing.

<br />

---

## The product

<br />

**Dashboard**
Live churn risk scores across every account. Filterable by plan and risk level. Click any customer for an inline profile snapshot. Animated KPI cards and a colour-coded bar chart that updates as you filter.

<br />

**Customer Intelligence**
A full sortable, searchable table with mini sparkline trend charts, risk score bars, and plan badges. Click any row to expand a detail panel — six stats, a risk gauge, and a visual journey stage indicator — all inline, no page reload.

<br />

**Journey Map**
Four stages rendered as a live pipeline — Onboarded, Active, At-Risk, Churned. Click any stage to see exactly who is there, their risk scores, and the average health of that cohort. Animated fill bars show the distribution at a glance.

<br />

**Lifecycle**
A carousel of all 25 customers. Select anyone and scroll through a three-act narrative of their engagement decline. A sticky profile card morphs smoothly between Active, Warning, and Critical states as you read — powered by Framer Motion.

<br />

**Alert Center**
The accounts that need a call today. A Mac-style terminal panel drafts a unique, personalized retention email for each one on demand. New sender, new subject, new copy — every single time. Typewriter effect included.

<br />

---

## How it works

The ML model trains on spend, login frequency, days since last contact, support ticket volume, and contract length. It outputs a probability score for every customer on startup. The email engine assembles copy from a pool of personas, openers, value props, and CTAs — producing thousands of unique combinations without a single API call.

<br />

---

## Stack

<div align="center">

| Layer | |
|---|---|
| Frontend | React · Framer Motion · Recharts |
| Backend | Python · Flask · Flask-CORS |
| Intelligence | scikit-learn · Pandas · NumPy |
| Typography | Space Mono · DM Sans |
| Deployment | Vercel |

</div>

<br />

---

## Digital Move — sponsor pillars

| | |
|---|---|
| Predictive churn scoring | Logistic regression model, score 0–100 per account |
| Automated outreach drafts | Template engine, unique copy on every generation |
| Customer journey mapping | Four-stage visual pipeline with expandable cohorts |
| Real-time alerts dashboard | Alert Center with risk meters and live email drafting |

<br />

---

## Running locally
```bash
# Backend
cd hackathon
pip install flask flask-cors pandas scikit-learn numpy
python3 app.py
# → http://localhost:5000

# Frontend
cd hackathon/frontend
npm install && npm start
# → http://localhost:3000
```

<br />

---

## Team

<div align="center">

**Ellison Naz** &nbsp;·&nbsp; **Rishav Bawa**

*ThunderHacks 2026 · Algoma University · March 2026*

<br />

<sub>Built with focus and very little sleep.</sub>

</div>

<div align="center">

<br />

<img src="https://img.shields.io/badge/ThunderHacks_2026-Algoma_University-00e5ff?style=for-the-badge&labelColor=0a0f1e" />
&nbsp;
<img src="https://img.shields.io/badge/Digital_Move-Gold_Sponsor_Challenge-f59e0b?style=for-the-badge&labelColor=0a0f1e" />

<br />
<br />
<br />

# RetainIQ

#### Know who's leaving. Reach them first.

<br />

**[Live Demo](https://retainiq-thunderhacks-2026.vercel.app)** · **[GitHub](https://github.com/ellitellicity-commits/retainiq-thunderhacks-2026)**

<br />
<br />

</div>

---

<br />

<div align="center">

**A customer retention intelligence platform built for Digital Move IT &amp; Telecom in 24 hours at ThunderHacks 2026.**

</div>

<br />

RetainIQ watches your entire customer base in real time — scoring churn risk, mapping customer journeys, and drafting personalized outreach — so your sales team stops reacting and starts preventing.

<br />

---

<br />

<div align="center">

### Gold Sponsor Challenge Winner

Selected as the winning project for the<br />**Digital Move IT &amp; Telecom Gold Sponsor Challenge** at ThunderHacks 2026.

<br />

<img src="./assets/thunderhacks-win.jpg" width="720" />

<br />
<sub>Winning the Digital Move Gold Sponsor Challenge · ThunderHacks 2026</sub>

</div>

<br />

---

<br />

## The Product

<br />

<table>
<tr>
<td width="180" valign="top"><strong>Dashboard</strong></td>
<td valign="top">Live churn risk scores across every account, filterable by plan and risk level. Click any customer for an inline profile snapshot. Animated KPI cards and a colour-coded bar chart update as you filter.</td>
</tr>
<tr><td colspan="2"><br /></td></tr>
<tr>
<td width="180" valign="top"><strong>Customer Intelligence</strong></td>
<td valign="top">A sortable, searchable table with mini sparkline trends, risk score bars, and plan badges. Click any row to expand a detail panel — six stats, a risk gauge, and a visual journey stage indicator — all inline, no page reload.</td>
</tr>
<tr><td colspan="2"><br /></td></tr>
<tr>
<td width="180" valign="top"><strong>Journey Map</strong></td>
<td valign="top">Four stages rendered as a live pipeline — Onboarded, Active, At-Risk, Churned. Click any stage to see exactly who is there, their risk scores, and the average health of that cohort.</td>
</tr>
<tr><td colspan="2"><br /></td></tr>
<tr>
<td width="180" valign="top"><strong>Lifecycle</strong></td>
<td valign="top">A carousel of all 25 customers. Select anyone and scroll through a three-act narrative of their engagement decline. A sticky profile card morphs smoothly between Active, Warning, and Critical states as you read — powered by Framer Motion.</td>
</tr>
<tr><td colspan="2"><br /></td></tr>
<tr>
<td width="180" valign="top"><strong>Alert Center</strong></td>
<td valign="top">The accounts that need a call today. A Mac-style terminal panel drafts personalized retention emails for high-risk accounts on demand, helping sales teams act quickly with tailored outreach.</td>
</tr>
</table>

<br />

---

<br />

## How It Works

<br />

The ML model trains on spend, login frequency, days since last contact, support ticket volume, and contract length. It outputs a probability score for every customer on startup. The email engine assembles copy from a pool of personas, openers, value props, and CTAs — producing thousands of unique combinations without a single API call.

<br />

---

<br />

## Stack

<br />

<div align="center">

| Layer | Technologies |
|:---|:---|
| **Frontend** | React · Framer Motion · Recharts |
| **Backend** | Python · Flask · Flask-CORS |
| **Intelligence** | scikit-learn · Pandas · NumPy |
| **Typography** | Space Mono · DM Sans |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

</div>

<br />

---

<br />

## Sponsor Pillars — Digital Move

<br />

| Capability | Implementation |
|:---|:---|
| **Predictive churn scoring** | Logistic regression model, score 0–100 per account |
| **Automated outreach drafts** | Template engine, unique copy on every generation |
| **Customer journey mapping** | Four-stage visual pipeline with expandable cohorts |
| **Real-time alerts dashboard** | Alert Center with risk meters and live email drafting |

<br />

---

<br />

## Running Locally

<br />

**Backend**

​```bash
cd retainiq-thunderhacks-2026
pip install -r requirements.txt
python app.py
# → http://localhost:5000
​```

**Frontend**

​```bash
cd retainiq-thunderhacks-2026/frontend
npm install && npm start
# → http://localhost:3000
​```

<br />

**Demo credentials** &nbsp;·&nbsp; *for demonstration purposes only*

​```
Username: digitalmove
Password: retainiq2026
​```

<br />

---

<br />

## Deployment Notes

<br />

The frontend is deployed on **Vercel** and the backend on **Render**. The backend runs on a free-tier service and may enter a sleep state after periods of inactivity.

The first request can take **60–90 seconds** to respond while the service wakes. Subsequent requests are significantly faster once active.

To pre-warm the backend before a demo, visit:<br />
`https://retainiq-thunderhacks-2026.onrender.com/api/customers`

<br />

---

<br />

<div align="center">

### Team

**Ellison Naz** &nbsp;·&nbsp; **Rishav Bawa**

<sub>ThunderHacks 2026 · Algoma University · March 2026</sub>

<br />

<sub>Built with focus and very little sleep.</sub>

</div>

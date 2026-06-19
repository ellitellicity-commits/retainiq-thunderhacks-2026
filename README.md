<div align="center">

<img src="https://img.shields.io/badge/ThunderHacks_2026-Algoma_University-00e5ff?style=for-the-badge&labelColor=0a0f1e" />
<img src="https://img.shields.io/badge/Digital_Move-Gold_Sponsor_Challenge-f59e0b?style=for-the-badge&labelColor=0a0f1e" />

<br />

# RetainIQ

### ↳ **Know who's leaving. Reach them first.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Preview-00e5ff?style=flat-square&logo=vercel&logoColor=white)](https://retainiq-thunderhacks-2026.vercel.app)
[![GitHub](https://img.shields.io/badge/Code-Repository-f59e0b?style=flat-square&logo=github&logoColor=white)](https://github.com/ellitellicity-commits/retainiq-thunderhacks-2026)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Hackathon](https://img.shields.io/badge/Built_In-24_Hours-black?style=flat-square)

</div>

---

## ⚙ Overview

RetainIQ is a customer retention intelligence platform built for **Digital Move IT & Telecom** in just 24 hours at ThunderHacks 2026. 

By analyzing your entire customer base in real time, RetainIQ automatically scores churn risk, maps customer journeys, and drafts personalized outreach copy. It transforms your retention workflow so your sales team stops reacting to churn and starts preventing it.

<div align="center">

### 🏆 Gold Sponsor Challenge Winner • ThunderHacks 2026

<img src="./assets/thunderhacks-win.jpg" width="720" alt="ThunderHacks Win" />

<sub>Winning the Digital Move Gold Sponsor Challenge at ThunderHacks 2026</sub>

</div>

---

## ⎔ Feature Architecture

* **System Dashboard:** Displays live churn risk scores across every account with quick filters for plan tier and risk level. Includes animated KPI cards and a responsive, color-coded bar chart that updates instantly as you filter data.
* **Customer Intelligence Center:** A sortable, searchable data table equipped with mini sparkline trends, risk bars, and plan badges. Clicking any row expands an inline detail panel containing six deep-dive stats, a risk gauge, and a visual journey stage indicator.
* **Pipeline Journey Map:** Outlines customer status across a four-stage pipeline: *Onboarded, Active, At-Risk, and Churned*. Teams can click any stage to inspect the exact cohort profile, individual risk scores, and the overall health rating of that segment.
* **Lifecycle Timeline:** A carousel interface holding all 25 customer profiles. Selecting a user lets you scroll through a three-act narrative tracking their engagement decline, backed by a sticky profile card that morphs seamlessly between Active, Warning, and Critical states using Framer Motion.
* **Automated Alert Center:** Highlights the high-priority accounts needing a phone call today. Features a terminal-style panel that automatically drafts personalized retention emails for at-risk accounts on demand.

---

## λ Predictive Logic & Data Flow

```text
[Customer Data] ──> [scikit-learn Model] ──> [Real-Time Risk Score] ──> [Persona Template Engine] ──> [Tailored Email Output]
```

1. **Predictive Modeling:** The ML model trains on historical data variables: customer spend, login frequency, days since last contact, support ticket volume, and contract length. It outputs an exact probability score (0 to 100) for every account upon startup.
2. **Copy Synthesis:** The email engine constructs targeted messaging from a modular pool of specific user personas, openers, value propositions, and calls to action. This produces thousands of unique copy variations smoothly without making external API requests.

---

## ⧉ Tech Stack

<div align="left">

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | `React` • `Framer Motion` • `Recharts` |
| **Backend API** | `Python` • `Flask` • `Flask-CORS` |
| **Data & ML** | `scikit-learn` • `Pandas` • `NumPy` |
| **Design** | `Space Mono` • `DM Sans` |
| **Deployment** | `Vercel` (Frontend) • `Render` (Backend) |

</div>

---

## 🎯 Sponsor Pillars: Digital Move

Our implementation matches the core priorities outlined for the Digital Move challenge:

* **Predictive churn scoring:** Handled via a robust Logistic Regression model evaluating variables to provide an accurate 0–100 risk metric per account.
* **Automated outreach drafts:** Powering unique, dynamic copy variants on every single generation through an efficient local template architecture.
* **Customer journey mapping:** Delivered as a visual four-stage pipeline featuring fully expandable cohort analytics.
* **Real-time alerts dashboard:** Integrated as a dedicated Alert Center complete with instant risk meters and immediate email text generation.

---

## $ Running Locally

### Backend Setup
```bash
cd retainiq-thunderhacks-2026
pip install -r requirements.txt
python app.py
# → Running on http://localhost:5000
```

### Frontend Setup
```bash
cd retainiq-thunderhacks-2026/frontend
npm install
npm start
# → Running on http://localhost:3000
```

> **Demo Credentials (for evaluation purposes only):**
> * **Username:** `digitalmove`
> * **Password:** `retainiq2026`

---

## ⚠️ Deployment Notes

The frontend lives on **Vercel** and the backend is hosted on **Render**. 

Because the backend runs on a free-tier instance, it will spin down into a sleep state after a period of inactivity. The initial request can take roughly **60 to 90 seconds** while the container provisions. Subsequent requests execute instantly.

↳ **Pro-Tip:** To pre-warm the backend right before a live presentation, visit: `https://retainiq-thunderhacks-2026.onrender.com/api/customers`

---

<div align="center">

**Ellison Naz** • **Rishav Bawa**

<sub>ThunderHacks 2026 • Algoma University • March 2026</sub>

<sub>Built with focus, intensity, and very little sleep.</sub>

</div>

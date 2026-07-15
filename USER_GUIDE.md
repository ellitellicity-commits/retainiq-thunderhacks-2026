# RetainIQ CRM - User Guide

## Overview

RetainIQ is an AI-native CRM platform designed for enterprise sales teams. It combines traditional CRM functionality (client management, deal pipeline, contacts) with an always-on AI Co-pilot that proactively recommends actions, drafts follow-up emails, and surfaces deal intelligence.

---

## Navigation

The sidebar provides access to all pages. It can be collapsed/expanded using the arrow button at the top.

| Page | Description |
|------|-------------|
| Dashboard | High-level KPIs and client overview |
| Clients | Full client list with contract details |
| Contacts | People directory across all clients |
| Pipeline | Kanban deal board with drag-and-drop |
| Analytics | Revenue forecasts and sales metrics |
| AI Co-pilot | Full-page AI intelligence center |
| Tasks | Task management with assignments |
| Sequences | Multi-step email cadence builder |
| Automations | Rule-based workflow automation |

### Global Features

- **Command Palette (Ctrl+K):** Quick search across clients, contacts, deals, and pages. Also provides quick actions (create deal, create task, add note, open copilot).
- **Notifications (bell icon):** Click the bell in the top-right to see notifications. Click any notification to mark it read, or use "Mark all read" to clear all.
- **AI Panel (AI button):** Opens a persistent side panel with priority actions, deal alerts, and ready-to-send emails.
- **Theme Toggle:** Switch between dark and light mode from the sidebar.

---

## Pages

### Dashboard

Displays four KPI cards:
- Total clients
- Contracts expiring within 90 days
- Critical/expired contracts
- Total value at risk

Below the KPIs is a filterable client table. Use the filter pills (All / Critical / At Risk / Healthy) to narrow the view.

**Actions:** View-only. Click through to Clients page for details.

---

### Clients

A searchable, sortable, filterable table of all client companies.

**Filters available:**
- Text search by company name
- Status pills: All, Critical, At-Risk, Active
- Renewal window: Any, 30 days, 60 days, 90 days
- Value range: Min/max contract value
- Sort by: Renewal date, Value, Company name

**Actions:**
- Click any row to open the client detail drawer
- **Details tab:** View contract info, manage contacts (add/edit/delete), view quotes, generate AI renewal email
- **Activity tab:** View chronological activity timeline (calls, emails, meetings, notes)
- **Notes tab:** Add and view notes for the client

**AI Email Generator:**
- Click "Generate renewal email" in the client drawer
- Select recipient from dropdown
- AI generates a personalized email with subject line
- Edit the content, then use "Open in email" or "Copy"
- "Regenerate" to get a fresh version

---

### Contacts

A directory of all people across your client companies.

**Filters:**
- Text search by name, title, or email
- Company dropdown filter
- "Primary only" toggle to show key contacts
- "Clear filters" to reset

**Actions:** View-only. Email links open your mail client.

---

### Pipeline

A visual Kanban board with 7 stages: New Leads, Qualified, Demo, Quote Sent, Negotiation, Closed-Won, Closed-Lost.

**Actions:**
- **Drag and drop** deal cards between stages to update their status
- **Click a card** to open the detail drawer with full edit form
- **"+ New deal" button** to create a new deal (company, value, stage, owner, product, source, dates)
- **Save changes** to update an existing deal
- **"Mark Won" / "Mark Lost"** to close a deal
- **"Delete deal"** to remove it
- **Quote Builder** (inside deal drawer):
  - Add line items with description, quantity, unit price
  - Set discount percentage
  - View calculated subtotal and total
  - "Save quote" persists it
  - "Mark as sent" updates quote status

**Visual indicators:**
- Color-coded stage columns
- Health badges: Stalled (red), Action due (amber), Whale (green for $100K+)
- Deal size tier: Enterprise, Mid-market, SMB

---

### Analytics

Revenue analytics computed from your pipeline data.

**Displays:**
- Pipeline value, weighted forecast, win rate, avg deal size
- Revenue forecast bar chart (configurable: 3, 6, or 12 month horizon)
- Pipeline funnel visualization
- Open pipeline by rep (horizontal bar chart)
- Summary sales metrics table

**Actions:** Change forecast horizon via dropdown. All other data auto-computes.

---

### AI Co-pilot (Full Page)

The AI intelligence center showing deep insights.

**Sections:**
- **Stats:** Active insights count, pending actions, average confidence score
- **Relationship Intelligence Map:** Interactive node graph showing contact relationships per company. Switch companies via tabs. Nodes are color-coded by relationship warmth (hot/warm/cold).
- **Meeting Prep:** Select a company to see AI-generated prep including context, recent activity, talking points, key stakeholders, and risks.
- **Deal Insights:** Cards showing deal health alerts with severity, AI recommendations, and confidence scores.

---

### AI Co-pilot (Side Panel)

Click the "AI" button in the top-right to open.

**Sections:**
- **Priority Actions:** Ranked list of recommended actions with impact scores, company, and reasoning.
- **Deal Alerts:** Risk alerts with severity badges, AI recommendations, and confidence bars.
- **Ready to Send:** AI-drafted follow-up emails.
  - **Send:** Sends the email (shows sending animation, then removes from list)
  - **Edit:** Opens a modal to modify subject and body before sending

---

### Tasks

Task management for your sales team.

**Filters:** All, My Tasks, Overdue, Due This Week, Completed

**Stats:** Total tasks, overdue count, due today, completed

**Actions:**
- **"Add Task" button:** Opens modal to create a task with:
  - Title, due date, priority (critical/high/medium/low)
  - Assignee, linked deal, type (follow-up/call/meeting/etc.)
- **Toggle checkboxes** to mark tasks complete/incomplete
- Filter pills to narrow the view

---

### Email Sequences

Multi-step email cadence management.

**Stats:** Active sequences, total enrolled contacts, average reply rate

**Displays:** Sequence cards with visual step timelines (day markers, status indicators, open/reply metrics)

**Actions:**
- **"Create Sequence" button:** Opens modal to build a new sequence:
  - Name the sequence
  - Add steps (set day, type: email/task, subject line)
  - Add/remove steps dynamically
- View per-step metrics (open rate, reply rate) for active sequences

---

### Automations

Rule-based workflow automation.

**Stats:** Active rules count, total times triggered, last triggered date

**Displays:** Rule cards with visual WHEN/THEN flow (trigger condition and action)

**Actions:**
- **"Create Rule" button:** Opens modal with:
  - Rule name
  - WHEN trigger condition
  - THEN action to perform
- **Toggle switch** on each rule to enable/disable it
- View trigger count and last triggered date per rule

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K (or Cmd+K) | Open command palette |
| Escape | Close any modal/palette |
| Arrow keys | Navigate command palette results |
| Enter | Select command palette item |

---

## Tips

1. Use the Command Palette for fastest navigation - type to search anything
2. The AI side panel stays open as you navigate between pages
3. Deal drag-and-drop auto-saves to the database
4. Generated AI emails can be customized before sending
5. The relationship map helps identify warm vs cold contacts before meetings

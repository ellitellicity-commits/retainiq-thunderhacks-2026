import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_CONFIG = {
  Enterprise: { color: "#8b5cf6", glow: "rgba(139,92,246,0.35)" },
  Pro:        { color: "#00e5ff", glow: "rgba(0,229,255,0.35)" },
  Basic:      { color: "#7a8fb0", glow: "rgba(122,143,176,0.2)" },
};

function getRiskColor(score) {
  if (score > 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

function getRiskLabel(score) {
  if (score > 70) return "HIGH";
  if (score >= 40) return "MED";
  return "LOW";
}

function MiniSparkline({ score, color }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const noise = (Math.random() - 0.5) * 20;
    return Math.max(5, Math.min(95, score + noise - i * (score / 10)));
  }).reverse();

  const w = 60, h = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const norm = points.map(p => h - ((p - min) / (max - min + 1)) * h);
  const path = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${y}`).join(" ");

  return (
    <svg width={w} height={h} style={{ opacity: 0.7 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(w)} cy={norm[norm.length - 1]} r="2.5" fill={color} />
    </svg>
  );
}

function CustomerRow({ customer, index, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const riskColor = getRiskColor(customer.churn_risk_score);
  const planCfg = PLAN_CONFIG[customer.plan] || PLAN_CONFIG.Basic;
  const initials = customer.name.split(" ").map(n => n[0]).join("");

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Name */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            animate={{ borderColor: isSelected ? riskColor : riskColor + "40", background: isSelected ? `${riskColor}20` : `${riskColor}10` }}
            transition={{ duration: 0.3 }}
            style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: riskColor, border: "1px solid", flexShrink: 0 }}
          >
            {initials}
          </motion.div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#e8f0fe" }}>{customer.name}</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", letterSpacing: 0.5 }}>{customer.email}</div>
          </div>
        </div>
      </td>

      {/* Plan */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Space Mono", background: `${planCfg.color}12`, color: planCfg.color, border: `1px solid ${planCfg.color}25` }}>
          {customer.plan}
        </span>
      </td>

      {/* Spend */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", fontFamily: "Space Mono", fontSize: 13, color: "#e8f0fe", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <span style={{ color: "#00e5ff" }}>$</span>{customer.spend}
        <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", marginTop: 2 }}>/month</div>
      </td>

      {/* Logins */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 13, color: "#e8f0fe" }}>{customer.logins}</div>
        <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", marginTop: 2 }}>{customer.days_since_contact}d ago</div>
      </td>

      {/* Sparkline */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <MiniSparkline score={customer.churn_risk_score} color={riskColor} />
      </td>

      {/* Risk score */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 52, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${customer.churn_risk_score}%` }}
              transition={{ duration: 0.8, delay: index * 0.03 }}
              style={{ height: "100%", background: riskColor, borderRadius: 4 }}
            />
          </div>
          <motion.span
            animate={{ color: riskColor }}
            style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, minWidth: 28 }}
          >
            {customer.churn_risk_score}
          </motion.span>
          <span style={{ fontFamily: "Space Mono", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${riskColor}15`, color: riskColor, border: `1px solid ${riskColor}25` }}>
            {getRiskLabel(customer.churn_risk_score)}
          </span>
        </div>
      </td>

      {/* Stage */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent", transition: "background 0.15s ease" }}>
        <span style={{ fontFamily: "Space Mono", fontSize: 10, fontWeight: 700, color: riskColor, letterSpacing: 0.5 }}>
          {customer.journey_stage}
        </span>
      </td>
    </motion.tr>
  );
}

function CustomerDetail({ customer, onClose }) {
  const riskColor = getRiskColor(customer.churn_risk_score);
  const planCfg = PLAN_CONFIG[customer.plan] || PLAN_CONFIG.Basic;

  const stats = [
    { label: "Monthly Spend",     value: `$${customer.spend}`,             color: "#00e5ff" },
    { label: "Login Count",       value: customer.logins,                   color: planCfg.color },
    { label: "Days No Contact",   value: customer.days_since_contact,       color: customer.days_since_contact > 30 ? "#ef4444" : "#10b981" },
    { label: "Support Tickets",   value: customer.support_tickets,          color: customer.support_tickets > 3 ? "#f59e0b" : "#10b981" },
    { label: "Contract Months",   value: customer.contract_months,          color: "#8b5cf6" },
    { label: "Churn Risk",        value: `${customer.churn_risk_score}/100`,color: riskColor },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 12, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ overflow: "hidden", marginBottom: 12 }}
    >
      <div style={{
        background: "#1a2236",
        border: `1px solid ${riskColor}30`,
        borderTop: `2px solid ${riskColor}`,
        borderRadius: 16,
        padding: 22,
        boxShadow: `0 0 30px ${riskColor}15`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${riskColor}18`, border: `2px solid ${riskColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono", fontSize: 16, fontWeight: 700, color: riskColor }}>
              {customer.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8f0fe" }}>{customer.name}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginTop: 2 }}>{customer.email}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 8, padding: "6px 12px", color: "#3d5070", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer", letterSpacing: 1 }}
          >
            CLOSE ✕
          </motion.button>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ background: "#0d1526", border: "1px solid rgba(0,229,255,0.08)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}
            >
              <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Risk bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
            <span>Churn Risk Score</span>
            <span style={{ color: riskColor }}>{customer.churn_risk_score}/100</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${customer.churn_risk_score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${riskColor}90, ${riskColor})`, borderRadius: 4, boxShadow: `0 0 10px ${riskColor}60` }}
            />
          </div>
        </div>

        {/* Journey stage */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {["Onboarded","Active","At-Risk","Churned"].map(stage => {
            const isActive = stage === customer.journey_stage;
            const stageColors = { Onboarded: "#10b981", Active: "#00e5ff", "At-Risk": "#f59e0b", Churned: "#ef4444" };
            return (
              <div key={stage} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 7, background: isActive ? `${stageColors[stage]}18` : "rgba(255,255,255,0.02)", border: `1px solid ${isActive ? stageColors[stage] + "50" : "rgba(255,255,255,0.04)"}` }}>
                <div style={{ fontFamily: "Space Mono", fontSize: 8, fontWeight: 700, color: isActive ? stageColors[stage] : "#3d5070", textTransform: "uppercase", letterSpacing: 0.8 }}>{stage}</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function Customers({ API }) {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("churn_risk_score");
  const [sortDir, setSortDir] = useState("desc");
  const [planFilter, setPlanFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/customers`).then(r => r.json()).then(setCustomers);
  }, [API]);

  const filtered = customers
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchPlan = planFilter === "all" || c.plan === planFilter;
      const matchRisk = riskFilter === "all" || (riskFilter === "high" && c.churn_risk_score > 70) || (riskFilter === "medium" && c.churn_risk_score >= 40 && c.churn_risk_score <= 70) || (riskFilter === "low" && c.churn_risk_score < 40);
      return matchSearch && matchPlan && matchRisk;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (typeof a[sortBy] === "string") return dir * a[sortBy].localeCompare(b[sortBy]);
      return dir * (a[sortBy] - b[sortBy]);
    });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortTh = ({ col, label }) => (
    <th
      onClick={() => toggleSort(col)}
      style={{ padding: "10px 16px", textAlign: "left", fontFamily: "Space Mono", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sortBy === col ? "#00e5ff" : "#3d5070", borderBottom: "1px solid rgba(0,229,255,0.1)", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}
    >
      {label} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Customer <span style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.5)" }}>Intelligence</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          {customers.length} customers tracked · click any row to inspect
        </div>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#3d5070", fontSize: 13 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            style={{ width: "100%", background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 9, padding: "8px 14px 8px 32px", fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#e8f0fe", outline: "none", transition: "border-color 0.2s ease" }}
            onFocus={e => e.target.style.borderColor = "rgba(0,229,255,0.3)"}
            onBlur={e => e.target.style.borderColor = "rgba(0,229,255,0.12)"}
          />
        </div>

        {/* Plan filter */}
        {["all","Enterprise","Pro","Basic"].map(p => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPlanFilter(p)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1px solid ${planFilter === p ? (PLAN_CONFIG[p]?.color || "#00e5ff") : "rgba(0,229,255,0.1)"}`,
              background: planFilter === p ? `${PLAN_CONFIG[p]?.color || "#00e5ff"}15` : "transparent",
              color: planFilter === p ? (PLAN_CONFIG[p]?.color || "#00e5ff") : "#3d5070",
              fontFamily: "Space Mono",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "all 0.2s ease",
              textTransform: "uppercase",
            }}
          >
            {p === "all" ? "All Plans" : p}
          </motion.button>
        ))}

        {/* Risk filter */}
        {[
          { id: "all",    label: "All Risk",  color: "#00e5ff" },
          { id: "high",   label: "High",      color: "#ef4444" },
          { id: "medium", label: "Medium",    color: "#f59e0b" },
          { id: "low",    label: "Low",       color: "#10b981" },
        ].map(f => (
          <motion.button
            key={f.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRiskFilter(f.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1px solid ${riskFilter === f.id ? f.color : "rgba(0,229,255,0.1)"}`,
              background: riskFilter === f.id ? `${f.color}15` : "transparent",
              color: riskFilter === f.id ? f.color : "#3d5070",
              fontFamily: "Space Mono",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "all 0.2s ease",
            }}
          >
            {f.label}
          </motion.button>
        ))}

        <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginLeft: "auto" }}>
          {filtered.length} RESULTS
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.1)", borderRadius: 16, overflow: "hidden" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0d1526" }}>
              <SortTh col="name"              label="Customer" />
              <SortTh col="plan"              label="Plan" />
              <SortTh col="spend"             label="Spend" />
              <SortTh col="logins"            label="Logins" />
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "Space Mono", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#3d5070", borderBottom: "1px solid rgba(0,229,255,0.1)" }}>Trend</th>
              <SortTh col="churn_risk_score"  label="Risk Score" />
              <SortTh col="journey_stage"     label="Stage" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((c, i) => (
                <React.Fragment key={c.id}>
                  <CustomerRow
                    customer={c}
                    index={i}
                    isSelected={selected?.id === c.id}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  />
                  {selected?.id === c.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: "0 12px 12px", background: "transparent" }}>
                        <CustomerDetail customer={selected} onClose={() => setSelected(null)} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, fontFamily: "Space Mono", fontSize: 12, color: "#3d5070", letterSpacing: 1 }}>
            NO CUSTOMERS MATCH YOUR FILTERS
          </div>
        )}
      </motion.div>
    </div>
  );
}

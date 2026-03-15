import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const color = score > 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
  return (
    <div style={{ background: "#1a2236", border: `1px solid ${color}40`, borderRadius: 10, padding: "10px 14px", fontFamily: "Space Mono", fontSize: 11 }}>
      <div style={{ color: "#7a8fb0", marginBottom: 4 }}>{label}</div>
      <div style={{ color, fontSize: 18, fontWeight: 700 }}>{score}<span style={{ fontSize: 11, color: "#3d5070" }}>/100</span></div>
    </div>
  );
};

function StatCard({ icon, label, value, sub, accent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.03 }}
      style={{
        background: "#1a2236",
        border: `1px solid ${hovered ? accent + "50" : "rgba(0,229,255,0.12)"}`,
        borderRadius: 16,
        padding: "22px 20px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0.7 }} />

      {/* Background glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.08 : 0.03 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: accent, borderRadius: "50%" }}
      />

      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "Space Mono", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#3d5070", marginBottom: 8 }}>{label}</div>
      <motion.div
        animate={{ color: accent, textShadow: hovered ? `0 0 20px ${accent}` : "none" }}
        transition={{ duration: 0.3 }}
        style={{ fontFamily: "Space Mono", fontSize: 36, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}
      >
        {value}
      </motion.div>
      <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginTop: 8 }}>{sub}</div>
    </motion.div>
  );
}

export default function Dashboard({ API }) {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/stats`).then(r => r.json()).then(setStats);
    fetch(`${API}/api/customers`).then(r => r.json()).then(setCustomers);
  }, [API]);

  if (!stats) return (
    <div style={{ color: "#3d5070", fontFamily: "Space Mono", fontSize: 12, paddingTop: 60, textAlign: "center", letterSpacing: 2 }}>
      LOADING SYSTEMS...
    </div>
  );

  const getColor = (score) => score > 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";

  const filtered = customers.filter(c => {
    if (filter === "high") return c.churn_risk_score > 70;
    if (filter === "medium") return c.churn_risk_score >= 40 && c.churn_risk_score <= 70;
    if (filter === "low") return c.churn_risk_score < 40;
    return true;
  });

  const statCards = [
    { icon: "◈", label: "Total Customers", value: stats.total_customers, accent: "#00e5ff",  sub: "across all plans",   delay: 0.05 },
    { icon: "⬡", label: "High Risk",       value: stats.high_risk_count,  accent: "#ef4444",  sub: "score above 70",    delay: 0.10 },
    { icon: "◎", label: "Medium Risk",     value: stats.medium_risk_count,accent: "#f59e0b",  sub: "score 40–70",       delay: 0.15 },
    { icon: "▦", label: "Healthy",         value: stats.low_risk_count,   accent: "#10b981",  sub: "score below 40",    delay: 0.20 },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 26 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Mission <span style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.5)" }}>Control</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          Real-time customer retention intelligence · Digital Move IT & Telecom
        </div>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        {[
          { id: "all",    label: "All",    color: "#00e5ff" },
          { id: "high",   label: "High Risk",   color: "#ef4444" },
          { id: "medium", label: "Medium Risk", color: "#f59e0b" },
          { id: "low",    label: "Healthy",     color: "#10b981" },
        ].map(f => (
          <motion.button
            key={f.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setFilter(f.id); setSelected(null); }}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              border: `1px solid ${filter === f.id ? f.color : "rgba(0,229,255,0.1)"}`,
              background: filter === f.id ? `${f.color}18` : "transparent",
              color: filter === f.id ? f.color : "#3d5070",
              fontFamily: "Space Mono",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "all 0.2s ease",
            }}
          >
            {f.label}
          </motion.button>
        ))}
        <div style={{ marginLeft: "auto", fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", display: "flex", alignItems: "center" }}>
          {filtered.length} CUSTOMERS
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 16, padding: 22, marginBottom: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: "#7a8fb0", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Churn Risk Score — All Customers
          </div>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontFamily: "Space Mono", fontSize: 11, color: getColor(selected.churn_risk_score), background: `${getColor(selected.churn_risk_score)}18`, padding: "4px 12px", borderRadius: 999, border: `1px solid ${getColor(selected.churn_risk_score)}40` }}
            >
              {selected.name} · {selected.churn_risk_score}
            </motion.div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={filtered} barCategoryGap="28%" onClick={(d) => d?.activePayload && setSelected(d.activePayload[0].payload)}>
            <XAxis dataKey="name" tick={{ fill: "#3d5070", fontSize: 9, fontFamily: "Space Mono" }} interval={0} angle={-40} textAnchor="end" height={52} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#3d5070", fontSize: 10, fontFamily: "Space Mono" }} domain={[0,100]} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,229,255,0.04)" }} />
            <Bar dataKey="churn_risk_score" radius={[4,4,0,0]}>
              {filtered.map((c, i) => (
                <Cell
                  key={i}
                  fill={getColor(c.churn_risk_score)}
                  opacity={selected ? (selected.id === c.id ? 1 : 0.35) : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: "1px solid rgba(0,229,255,0.06)" }}>
          {[["#10b981","Low Risk (< 40)"],["#f59e0b","Medium (40–70)"],["#ef4444","High Risk (> 70)"]].map(([c,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#3d5070", fontFamily: "Space Mono" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Selected customer detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            style={{ background: "#1a2236", border: `1px solid ${getColor(selected.churn_risk_score)}40`, borderLeft: `3px solid ${getColor(selected.churn_risk_score)}`, borderRadius: 14, padding: 20, marginBottom: 16, overflow: "hidden" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Space Mono", fontSize: 14, fontWeight: 700, color: "#e8f0fe", marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", letterSpacing: 1 }}>
                  {selected.plan} · ${selected.spend}/mo · {selected.days_since_contact} days no contact · {selected.support_tickets} tickets
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Space Mono", fontSize: 28, fontWeight: 700, color: getColor(selected.churn_risk_score) }}>{selected.churn_risk_score}</div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", letterSpacing: 1 }}>RISK SCORE</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(null)}
                  style={{ background: "transparent", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#3d5070", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}
                >
                  CLOSE ✕
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}
      >
        {(stats.by_plan || []).map((p, i) => (
          <motion.div
            key={p.plan}
            whileHover={{ y: -4, borderColor: "rgba(0,229,255,0.28)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 14, padding: 18, cursor: "default" }}
          >
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{p.plan} Plan</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 26, fontWeight: 700, color: "#e8f0fe", marginBottom: 6 }}>{p.count}</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, p.avg_score)}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 4, background: getColor(p.avg_score) }}
              />
            </div>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070" }}>avg risk · <span style={{ color: getColor(p.avg_score) }}>{p.avg_score}</span></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

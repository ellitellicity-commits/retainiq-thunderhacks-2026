import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGE_CONFIG = {
  Active:   { color: "#10b981", glow: "rgba(16,185,129,0.35)",  icon: "✅", desc: "Contract healthy, well within expiry" },
  "At-Risk":{ color: "#f59e0b", glow: "rgba(245,158,11,0.35)",  icon: "⚠️", desc: "Contract expiring within 90 days" },
  Critical: { color: "#ef4444", glow: "rgba(239,68,68,0.35)",   icon: "🔴", desc: "Contract expiring within 30 days" },
  Expired:  { color: "#7a8fb0", glow: "rgba(122,143,176,0.35)", icon: "💔", desc: "Contract already expired" },
};

function StageCard({ stage, count, customers, isSelected, onClick, delay }) {
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG["Active"];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: isSelected ? `${cfg.color}10` : "#1a2236",
        border: `1px solid ${isSelected || hovered ? cfg.color + "60" : "rgba(0,229,255,0.12)"}`,
        borderTop: `3px solid ${cfg.color}`,
        borderRadius: 16,
        padding: 22,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: isSelected ? `0 0 30px ${cfg.glow}` : "none",
        transition: "box-shadow 0.3s ease, background 0.3s ease",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{cfg.icon}</div>
      <div style={{ fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{stage}</div>
      <motion.div
        animate={{ color: cfg.color, textShadow: isSelected ? `0 0 20px ${cfg.color}` : "none" }}
        transition={{ duration: 0.3 }}
        style={{ fontFamily: "Space Mono", fontSize: 40, fontWeight: 700, letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}
      >
        {count}
      </motion.div>
      <div style={{ fontSize: 12, color: "#3d5070", marginBottom: 12 }}>{cfg.desc}</div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          style={{ height: "100%", background: cfg.color, borderRadius: 4 }}
        />
      </div>
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ marginTop: 10, fontFamily: "Space Mono", fontSize: 9, color: cfg.color, letterSpacing: 1.5, textTransform: "uppercase" }}
      >
        {isSelected ? "CLICK TO CLOSE ✕" : "CLICK TO EXPAND →"}
      </motion.div>
    </motion.div>
  );
}

function ClientRow({ customer, color, index }) {
  const [hovered, setHovered] = useState(false);
  const initials = customer.client_name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 6 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 14px",
        borderBottom: "1px solid rgba(0,229,255,0.05)",
        background: hovered ? `${color}08` : "transparent",
        borderRadius: 8,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}18`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8f0fe" }}>{customer.client_name}</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", letterSpacing: 0.5, textTransform: "uppercase" }}>{customer.vendor} · {customer.software}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 60, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${customer.churn_risk_score}%` }}
            transition={{ duration: 0.8, delay: index * 0.04 }}
            style={{ height: "100%", background: color, borderRadius: 4 }}
          />
        </div>
        <div style={{ fontFamily: "Space Mono", fontSize: 12, fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>
          {customer.churn_risk_score}
        </div>
      </div>
    </motion.div>
  );
}

export default function Journey({ API }) {
  const [stages, setStages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/db/clients`).then(r => r.json()).then(data => {
      const stageNames = ["Active", "At-Risk", "Critical", "Expired"];
      const grouped = stageNames.map(s => ({
        stage: s,
        count: data.filter(c => c.journey_stage === s).length,
        customers: data.filter(c => c.journey_stage === s)
      }));
      setStages(grouped);
      setTotalClients(data.length);
    });
  }, [API]);

  if (!stages.length) return (
    <div style={{ color: "#3d5070", fontFamily: "Space Mono", fontSize: 12, paddingTop: 60, textAlign: "center", letterSpacing: 2 }}>
      LOADING JOURNEY DATA...
    </div>
  );

  const selectedStage = stages.find(s => s.stage === selected);
  const cfg = selected ? STAGE_CONFIG[selected] : null;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 26 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Contract <span style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.5)" }}>Pipeline</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          Click any stage to explore clients · {totalClients} total clients tracked
        </div>
      </motion.div>

      {/* Stage cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 22 }}>
        {stages.map((s, i) => (
          <StageCard
            key={s.stage}
            stage={s.stage}
            count={s.count}
            customers={s.customers}
            isSelected={selected === s.stage}
            onClick={() => setSelected(selected === s.stage ? null : s.stage)}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* Expanded client list */}
      <AnimatePresence>
        {selected && selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              background: "#1a2236",
              border: `1px solid ${cfg.color}30`,
              borderTop: `2px solid ${cfg.color}`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 0 30px ${cfg.glow}`,
            }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,229,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Space Mono", fontSize: 12, fontWeight: 700, color: cfg.color, letterSpacing: 1.5, textTransform: "uppercase" }}>{selected} Stage</div>
                    <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginTop: 2 }}>{selectedStage.count} clients · {cfg.desc}</div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 8, padding: "6px 12px", color: "#3d5070", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer", letterSpacing: 1 }}>
                  CLOSE ✕
                </motion.button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "1px solid rgba(0,229,255,0.06)" }}>
                <span>Client</span>
                <span>Risk Score</span>
              </div>

              <div style={{ padding: "8px 6px", maxHeight: 320, overflowY: "auto" }}>
                {selectedStage.customers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 30, fontFamily: "Space Mono", fontSize: 11, color: "#3d5070" }}>No clients in this stage</div>
                ) : (
                  selectedStage.customers.map((c, i) => (
                    <ClientRow key={c.id} customer={c} color={cfg.color} index={i} />
                  ))
                )}
              </div>

              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,229,255,0.06)", display: "flex", gap: 24, fontFamily: "Space Mono", fontSize: 10, color: "#3d5070" }}>
                <span>TOTAL <span style={{ color: cfg.color }}>{selectedStage.count}</span></span>
                <span>AVG RISK <span style={{ color: cfg.color }}>
                  {selectedStage.customers.length > 0 ? Math.round(selectedStage.customers.reduce((s, c) => s + c.churn_risk_score, 0) / selectedStage.customers.length) : 0}
                </span></span>
                <span>SHARE <span style={{ color: cfg.color }}>{Math.round((selectedStage.count / totalClients) * 100)}%</span></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

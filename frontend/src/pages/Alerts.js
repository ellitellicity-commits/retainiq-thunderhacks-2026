import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TypeWriter({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!text) return;
    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [text, speed]);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ display: "inline-block", width: 7, height: 13, background: "#00e5ff", verticalAlign: "middle", marginLeft: 2, boxShadow: "0 0 8px #00e5ff" }}
      />
    </span>
  );
}

function RiskMeter({ score }) {
  const color = score > 85 ? "#ef4444" : score > 70 ? "#f59e0b" : "#10b981";
  const segments = 10;
  const filled = Math.round((score / 100) * segments);

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            width: 4,
            height: i < filled ? 16 + (i % 3) * 3 : 8,
            borderRadius: 2,
            background: i < filled ? color : "rgba(255,255,255,0.06)",
            boxShadow: i < filled ? `0 0 6px ${color}` : "none",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

function AlertCard({ customer, isSelected, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const score = customer.churn_risk_score;
  const color = score > 85 ? "#ef4444" : "#f59e0b";
  const initials = customer.name.split(" ").map(n => n[0]).join("");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ x: 6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: isSelected ? `${color}08` : "#1a2236",
        border: `1px solid ${isSelected ? color + "50" : hovered ? "rgba(0,229,255,0.2)" : "rgba(0,229,255,0.1)"}`,
        borderLeft: `3px solid ${isSelected ? color : hovered ? "#00e5ff" : color + "60"}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "background 0.2s ease, border-color 0.2s ease",
        boxShadow: isSelected ? `0 0 20px ${color}20` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pulse animation for critical */}
      {score > 90 && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        <motion.div
          animate={{ borderColor: isSelected ? color : color + "40", background: isSelected ? `${color}20` : `${color}10` }}
          transition={{ duration: 0.3 }}
          style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color, border: "1px solid", flexShrink: 0 }}
        >
          {initials}
        </motion.div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e8f0fe", marginBottom: 3 }}>{customer.name}</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", letterSpacing: 0.5, textTransform: "uppercase" }}>
            {customer.plan} · ${customer.spend}/mo · {customer.days_since_contact}d no contact
          </div>
        </div>

        {/* Score + meter */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <motion.div
            animate={{ color, textShadow: isSelected ? `0 0 12px ${color}` : "none" }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, letterSpacing: -1 }}
          >
            {score}
          </motion.div>
          <RiskMeter score={score} />
        </div>
      </div>

      {/* Expand hint */}
      <motion.div
        animate={{ opacity: hovered || isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ marginTop: 8, fontFamily: "Space Mono", fontSize: 9, color: isSelected ? color : "#00e5ff", letterSpacing: 1.5, textTransform: "uppercase" }}
      >
        {isSelected ? "GENERATING EMAIL →" : "CLICK TO GENERATE EMAIL →"}
      </motion.div>
    </motion.div>
  );
}

export default function Alerts({ API }) {
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/alerts`).then(r => r.json()).then(d => {
      setAlerts(d.customers);
      setStats({ count: d.count });
    });
  }, [API]);

  const generateEmail = (customer) => {
    setSelected(customer);
    setEmail(null);
    setLoading(true);
    fetch(`${API}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customer.name,
        risk_score: customer.churn_risk_score,
        plan: customer.plan,
        spend: customer.spend,
        days_since_contact: customer.days_since_contact,
      }),
    })
      .then(r => r.json())
      .then(d => { setEmail(d); setLoading(false); });
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Alert <span style={{ color: "#ef4444", textShadow: "0 0 14px rgba(239,68,68,0.6)" }}>Center</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          Customers requiring immediate outreach · churn risk above 70
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}
      >
        {[
          { label: "At-Risk Customers", value: stats?.count ?? "—", color: "#ef4444", icon: "⬡" },
          { label: "Avg Risk Score",    value: alerts.length ? Math.round(alerts.reduce((s,c) => s + c.churn_risk_score, 0) / alerts.length) : "—", color: "#f59e0b", icon: "◎" },
          { label: "Revenue at Risk",   value: alerts.length ? `$${alerts.reduce((s,c) => s + c.spend, 0).toLocaleString()}` : "—", color: "#00e5ff", icon: "◈" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            whileHover={{ y: -4, scale: 1.02 }}
            style={{ background: "#1a2236", border: `1px solid ${s.color}25`, borderTop: `2px solid ${s.color}`, borderRadius: 14, padding: "16px 18px", cursor: "default", position: "relative", overflow: "hidden" }}
          >
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 30, fontWeight: 700, color: s.color, letterSpacing: -1, textShadow: `0 0 16px ${s.color}50` }}>{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* LEFT — alert list */}
        <div>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
            <span>High-Risk Customers</span>
            <span style={{ color: "#ef4444" }}>{alerts.length} ALERTS</span>
          </div>
          <div style={{ maxHeight: "calc(100vh - 380px)", overflowY: "auto", paddingRight: 4 }}>
            {alerts.map((c, i) => (
              <AlertCard
                key={c.id}
                customer={c}
                isSelected={selected?.id === c.id}
                onClick={() => generateEmail(c)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — terminal email panel */}
        <div>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            AI Email Generator
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ background: "#050d18", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.5)", minHeight: 420, display: "flex", flexDirection: "column" }}
          >
            {/* Terminal title bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#0a1628", borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              <div style={{ fontFamily: "Space Mono", fontSize: 11, color: "rgba(0,229,255,0.35)", marginLeft: 8, letterSpacing: 0.5 }}>
                retainiq@digital-move ~ email-generator
              </div>
            </div>

            {/* Terminal body */}
            <div style={{ flex: 1, padding: "18px 20px", fontFamily: "Space Mono", fontSize: 12, lineHeight: 1.9, color: "#00e5ff", overflowY: "auto" }}>

              {/* Empty state */}
              {!selected && !loading && !email && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: "center", paddingTop: 60 }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
                  <div style={{ color: "rgba(0,229,255,0.25)", fontSize: 11, lineHeight: 2 }}>
                    {">"} Select a customer from the list{"\n"}
                    {">"} AI will draft a retention email{"\n"}
                    {">"} Watch it type out in real-time
                  </div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ marginTop: 20, color: "rgba(0,229,255,0.3)", fontSize: 10 }}
                  >
                    AWAITING INPUT_
                  </motion.div>
                </motion.div>
              )}

              {/* Loading state */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ color: "rgba(0,229,255,0.5)", marginBottom: 8 }}>
                    {">"} Analyzing customer profile...
                  </div>
                  <div style={{ color: "rgba(0,229,255,0.5)", marginBottom: 8 }}>
                    {">"} Generating personalized email for <span style={{ color: "#00e5ff" }}>{selected?.name}</span>
                  </div>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ color: "#00e5ff" }}
                  >
                    {">"} Writing
                    <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 0.6, repeat: Infinity }}>...</motion.span>
                  </motion.div>
                </motion.div>
              )}

              {/* Email result */}
              {email && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Meta info */}
                  <div style={{ marginBottom: 4, color: "rgba(0,229,255,0.4)" }}>{">"} email compiled successfully</div>
                  <div style={{ height: 1, background: "rgba(0,229,255,0.08)", margin: "10px 0" }} />

                  <div style={{ marginBottom: 3 }}>
                    <span style={{ color: "#67e8f9", fontWeight: 700 }}>TO:</span>
                    <span style={{ color: "#a5f3fc", marginLeft: 8 }}>{email.customer_name}</span>
                  </div>
                  <div style={{ marginBottom: 3 }}>
                    <span style={{ color: "#67e8f9", fontWeight: 700 }}>PLAN:</span>
                    <span style={{ color: "#a5f3fc", marginLeft: 8 }}>{selected?.plan} · ${selected?.spend}/mo</span>
                  </div>
                  <div style={{ marginBottom: 3 }}>
                    <span style={{ color: "#67e8f9", fontWeight: 700 }}>RISK:</span>
                    <span style={{ color: "#ef4444", marginLeft: 8 }}>{selected?.churn_risk_score}/100</span>
                  </div>

                  <div style={{ height: 1, background: "rgba(0,229,255,0.08)", margin: "12px 0" }} />

                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: "#67e8f9", fontWeight: 700 }}>SUBJECT:</span>
                    <div style={{ color: "#cffafe", marginTop: 4, fontSize: 11 }}>
                      <TypeWriter key={email.subject} text={email.subject} speed={25} />
                    </div>
                  </div>

                  <div style={{ height: 1, background: "rgba(0,229,255,0.08)", margin: "12px 0" }} />

                  <div>
                    <span style={{ color: "#67e8f9", fontWeight: 700 }}>BODY:</span>
                    <div style={{ color: "#cffafe", marginTop: 6, fontSize: 11, lineHeight: 2 }}>
                      <TypeWriter key={email.body} text={email.body} speed={8} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Terminal footer */}
            <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(0,229,255,0.06)", display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 9, color: "rgba(0,229,255,0.2)" }}>
              <span>RETAINIQ v1.0 · DIGITAL MOVE</span>
              <span>{email ? "EMAIL READY" : loading ? "GENERATING..." : "STANDBY"}</span>
            </div>
          </motion.div>

          {/* Regenerate button */}
          <AnimatePresence>
            {email && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginTop: 12, display: "flex", gap: 10 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(0,229,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => generateEmail(selected)}
                  style={{ flex: 1, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 9, padding: "10px 16px", color: "#00e5ff", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}
                >
                  ↻ REGENERATE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { const text = `Subject: ${email.subject}\n\n${email.body}`; navigator.clipboard.writeText(text); }}
                  style={{ flex: 1, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 9, padding: "10px 16px", color: "#10b981", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}
                >
                  ✓ COPY EMAIL
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getSteps(customer) {
  const score = customer.churn_risk_score;
  const first = customer.name.split(" ")[0];
  return [
    {
      id: 0,
      label: "Step 1 of 3",
      title: `${first} is Active`,
      body: `${first} was logging in regularly, spending $${customer.spend}/mo consistently, and engaging with core features. Health score was strong and the account looked stable.`,
      status: "ACTIVE",
      statusColor: "#10b981",
      glowColor: "rgba(16,185,129,0.35)",
      engagement: Math.min(95, Math.max(60, 100 - Math.round(score * 0.3))),
      logins: Math.min(95, Math.max(55, 100 - Math.round(score * 0.35))),
      spend: Math.min(95, Math.max(50, Math.round((customer.spend / 1100) * 100))),
      alert: null,
      churnScore: Math.max(2, Math.round(score * 0.05)),
    },
    {
      id: 1,
      label: "Step 2 of 3",
      title: "Warning Signs Appear",
      body: `${first}'s login frequency dropped over the past ${customer.days_since_contact} days. Support tickets climbed to ${customer.support_tickets}. Engagement is falling fast and emails are going unopened.`,
      status: "WARNING",
      statusColor: "#f59e0b",
      glowColor: "rgba(245,158,11,0.35)",
      engagement: Math.max(20, Math.round(score * 0.45)),
      logins: Math.max(15, Math.round(score * 0.35)),
      spend: Math.max(25, Math.round((customer.spend / 1100) * 55)),
      alert: null,
      churnScore: Math.round(score * 0.5),
    },
    {
      id: 2,
      label: "Step 3 of 3",
      title: "Critical — Act Now",
      body: `${first} hasn't engaged in ${customer.days_since_contact} days. With ${customer.support_tickets} unresolved tickets and a declining spend of $${customer.spend}/mo, our model scores them at ${Math.round(score)}/100. Immediate outreach needed.`,
      status: "CRITICAL",
      statusColor: "#ef4444",
      glowColor: "rgba(239,68,68,0.5)",
      engagement: Math.max(4, Math.round(score * 0.07)),
      logins: Math.max(2, Math.round(score * 0.04)),
      spend: Math.max(6, Math.round(score * 0.1)),
      alert: `⚠ ${customer.days_since_contact} days inactive · ${customer.support_tickets} open tickets`,
      churnScore: Math.round(score),
    },
  ];
}

function UserCard({ customer, step }) {
  return (
    <motion.div
      animate={{
        boxShadow: `0 0 40px ${step.glowColor}, 0 0 80px ${step.glowColor}`,
        borderColor: step.statusColor,
      }}
      transition={{ duration: 0.6 }}
      style={{ background: "#1a2236", border: "1px solid", borderRadius: 20, padding: 28, width: 290 }}
    >
      <motion.div
        animate={{ borderColor: step.statusColor, background: `${step.statusColor}18` }}
        transition={{ duration: 0.6 }}
        style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontFamily: "Space Mono", fontWeight: 700, color: step.statusColor, margin: "0 auto 16px", border: "2px solid" }}
      >
        {customer.name.split(" ").map(n => n[0]).join("")}
      </motion.div>

      <div style={{ fontFamily: "Space Mono", fontSize: 14, fontWeight: 700, textAlign: "center", color: "#e8f0fe", marginBottom: 4 }}>{customer.name}</div>
      <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", textAlign: "center", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
        {customer.plan} · ${customer.spend}/mo
      </div>

      {[
        { label: "Engagement", value: step.engagement },
        { label: "Login Freq.", value: step.logins },
        { label: "Spend Score", value: step.spend },
      ].map(s => (
        <div key={s.label} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
            <span>{s.label}</span>
            <motion.span animate={{ color: step.statusColor }} transition={{ duration: 0.6 }}>{s.value}%</motion.span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${s.value}%`, background: step.statusColor }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ height: "100%", borderRadius: 4 }}
            />
          </div>
        </div>
      ))}

      <motion.div
        animate={{ background: `${step.statusColor}18`, color: step.statusColor, borderColor: `${step.statusColor}40` }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: 16, padding: "8px 14px", borderRadius: 8, fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: 2, textTransform: "uppercase", border: "1px solid" }}
      >
        {step.status}
      </motion.div>

      <AnimatePresence>
        {step.alert && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
            style={{ padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, textAlign: "center", background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", fontFamily: "Space Mono", letterSpacing: 0.5 }}
          >
            {step.alert}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 14, textAlign: "center", fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", letterSpacing: 1 }}>CHURN RISK</div>
      <motion.div
        animate={{ color: step.statusColor }}
        transition={{ duration: 0.6 }}
        style={{ fontFamily: "Space Mono", fontSize: 32, fontWeight: 700, textAlign: "center", letterSpacing: -1 }}
      >
        {String(step.churnScore).padStart(2, "0")}
        <span style={{ fontSize: 14, fontWeight: 400, color: "#3d5070" }}>/100</span>
      </motion.div>
    </motion.div>
  );
}

export default function Lifecycle({ API }) {
  const [customers, setCustomers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const stepRefs = useRef([]);
  const pillsRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/customers?sort=churn_risk_score&order=desc`)
      .then(r => r.json())
      .then(data => setCustomers(data));
  }, [API]);

  // Reset to step 0 when customer changes
  useEffect(() => {
    setActiveStep(0);
  }, [currentIndex]);

  // Scroll active pill into view
  useEffect(() => {
    if (pillsRef.current) {
      const activePill = pillsRef.current.children[currentIndex];
      if (activePill) activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  if (!customers.length) return (
    <div style={{ color: "var(--text3)", fontFamily: "Space Mono", fontSize: 13, paddingTop: 60, textAlign: "center" }}>
      LOADING CUSTOMERS...
    </div>
  );

  const customer = customers[currentIndex];
  const steps = getSteps(customer);

  const goTo = (i) => {
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  const prev = () => goTo((currentIndex - 1 + customers.length) % customers.length);
  const next = () => goTo((currentIndex + 1) % customers.length);

  const riskColor = (score) => score > 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Customer <span style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.5)" }}>Lifecycle</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          Spin through all {customers.length} customers · see each one's journey from active to at-risk
        </div>
      </div>

      {/* CAROUSEL */}
      <div style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 14, padding: "14px 16px", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>

        {/* Prev button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          onClick={prev}
          style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", color: "#00e5ff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
        >
          ‹
        </motion.button>

        {/* Scrollable pills */}
        <div ref={pillsRef} style={{ flex: 1, display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {customers.map((c, i) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => goTo(i)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${currentIndex === i ? riskColor(c.churn_risk_score) : "rgba(0,229,255,0.1)"}`,
                background: currentIndex === i ? `${riskColor(c.churn_risk_score)}18` : "transparent",
                color: currentIndex === i ? riskColor(c.churn_risk_score) : "#3d5070",
                fontFamily: "Space Mono",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                letterSpacing: 0.5,
                transition: "all 0.2s ease",
              }}
            >
              {c.name.split(" ")[0]}
            </motion.button>
          ))}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          onClick={next}
          style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", color: "#00e5ff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
        >
          ›
        </motion.button>

        {/* Counter */}
        <div style={{ fontFamily: "Space Mono", fontSize: 11, color: "#3d5070", whiteSpace: "nowrap", flexShrink: 0, minWidth: 48, textAlign: "right" }}>
          {currentIndex + 1}<span style={{ color: "#1e2840" }}>/</span>{customers.length}
        </div>
      </div>

      {/* Step buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {steps.map((s, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveStep(i)}
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              border: `1px solid ${activeStep === i ? s.statusColor : "rgba(0,229,255,0.12)"}`,
              background: activeStep === i ? `${s.statusColor}18` : "transparent",
              color: activeStep === i ? s.statusColor : "#3d5070",
              fontFamily: "Space Mono",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 1,
              transition: "all 0.2s ease",
            }}
          >
            {s.status}
          </motion.button>
        ))}
      </div>

      {/* Two column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>

        {/* LEFT — sticky animated card */}
        <div style={{ position: "sticky", top: 20, display: "flex", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}`}
              initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <UserCard customer={customer} step={steps[activeStep]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {steps.map((s, i) => (
            <motion.div
              key={`${currentIndex}-${i}`}
              ref={el => stepRefs.current[i] = el}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: activeStep === i ? 1 : 0.35, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ x: 5 }}
              onClick={() => setActiveStep(i)}
              style={{
                background: "#1a2236",
                border: `1px solid ${activeStep === i ? s.statusColor + "50" : "rgba(0,229,255,0.1)"}`,
                borderLeft: `3px solid ${s.statusColor}`,
                borderRadius: 14,
                padding: 22,
                cursor: "pointer",
                minHeight: 160,
              }}
            >
              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "Space Mono", fontSize: 16, fontWeight: 700, color: s.statusColor, marginBottom: 10 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: "#7a8fb0" }}>
                {s.body}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                {steps.map((st, j) => (
                  <motion.div
                    key={j}
                    animate={{ width: activeStep === j ? 22 : 6, background: j <= i ? s.statusColor : "#1e2840" }}
                    transition={{ duration: 0.3 }}
                    style={{ height: 5, borderRadius: 999 }}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {/* CTA */}
          <AnimatePresence>
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: 22, textAlign: "center" }}
              >
                <div style={{ fontFamily: "Space Mono", fontSize: 12, color: "#f87171", fontWeight: 700, marginBottom: 6 }}>
                  ⚠ {customer.name.split(" ")[0]} needs outreach NOW
                </div>
                <div style={{ fontSize: 12.5, color: "#7a8fb0", marginBottom: 14 }}>
                  Switch to Alerts tab to generate a retention email instantly
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 6px 28px rgba(239,68,68,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => alert("Go to the Alerts tab!")}
                  style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", color: "white", border: "none", borderRadius: 9, padding: "10px 22px", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1, boxShadow: "0 4px 20px rgba(239,68,68,0.35)" }}
                >
                  GENERATE RETENTION EMAIL →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

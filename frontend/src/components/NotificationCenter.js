import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NOTIFICATIONS } from "../data/mockData";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const ref = useRef(null);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const iconForType = (type) => {
    switch (type) {
      case "task_due": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
      case "deal_stalled": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
      case "ai_insight": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2"><path d="M12 2L9 9l-7 1 5 5-1.5 7L12 18.5l6.5 3.5L17 15l5-5-7-1z"/></svg>;
      case "deal_won": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
      case "mention": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.9 7.9"/></svg>;
      default: return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex", alignItems: "center", position: "relative" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--hover2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 360, maxHeight: 480, overflowY: "auto", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 1001 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: "var(--brand-bright)", cursor: "pointer", background: "none", border: "none", fontFamily: "Inter", fontWeight: 500 }}>Mark all read</button>}
            </div>
            <div>
              {notifications.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-start", background: n.read ? "transparent" : "var(--cyan-dim)", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (n.read) e.currentTarget.style.background = "var(--hover2)"; }}
                  onMouseLeave={e => { if (n.read) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ marginTop: 2 }}>{iconForType(n.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: "var(--text)", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{n.time}</div>
                  </div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-bright)", marginTop: 6, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Customers from "./pages/Customers";
import Contacts from "./pages/Contacts";
import Alerts from "./pages/Alerts";
import Journey from "./pages/Journey";
import "./App.css";

const API = "http://localhost:5001";

const ICONS = {
  dashboard: (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>),
  customers: (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.8 19c0-2.9 2.3-5 5.2-5s5.2 2.1 5.2 5"/><path d="M16.5 5.5a3 3 0 0 1 0 5.4"/><path d="M18.5 19c0-2.2-.9-3.9-2.3-4.8"/></svg>),
  contacts: (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M8 17c0-2 1.8-3.2 4-3.2s4 1.2 4 3.2"/></svg>),
  journey: (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>),
  alerts: (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V11M12 21V4M19 21v-6"/></svg>),
};

const SUN = (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
const MOON = (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>);

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [uploaded, setUploaded] = useState(true);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("riq_sidebar_collapsed") === "1"; } catch (e) { return false; }
  });
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("riq_theme") || document.body.dataset.theme || "dark"; } catch (e) { return "dark"; }
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    try { localStorage.setItem("riq_theme", theme); } catch (e) {}
  }, [theme]);

  const toggleSidebar = () => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem("riq_sidebar_collapsed", next ? "1" : "0"); } catch (e) {}
      return next;
    });
  };
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "customers", label: "Clients" },
    { id: "contacts",  label: "Contacts" },
    { id: "journey",   label: "Pipeline" },
    { id: "alerts",    label: "Analytics" },
  ];

  if (!uploaded) return <Upload API={API} onUpload={() => setUploaded(true)} onSkip={() => setUploaded(true)} onCancel={() => setUploaded(true)} />;

  const SIDEBAR_W = collapsed ? 66 : 222;
  const ghostBtn = {
    display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start",
    width: "100%", padding: collapsed ? "10px 0" : "10px 12px", borderRadius: 9,
    border: "1px solid var(--border2)", background: "transparent", color: "var(--text2)",
    fontFamily: "Inter", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 8,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)", color: "var(--text)", fontFamily: "Inter" }}>
      <aside style={{ width: SIDEBAR_W, flex: "0 0 auto", background: "var(--sidebar)", borderRight: "1px solid var(--border)", padding: collapsed ? "16px 9px" : "16px 14px", transition: "width .22s ease, padding .22s ease", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: 22 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 32, height: 32, flex: "0 0 auto", borderRadius: 9, background: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--logo-text)" }}>RetainIQ</div>
            </div>
          )}
          <button onClick={toggleSidebar} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", lineHeight: 0, flex: "0 0 auto" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover2)"; e.currentTarget.style.color = "var(--text2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; }}>
            {collapsed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><polyline points="13 9 15 12 13 15"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><polyline points="15 9 13 12 15 15"/></svg>
            )}
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map(tab => {
            const active = page === tab.id;
            return (
              <button key={tab.id} onClick={() => setPage(tab.id)} title={collapsed ? tab.label : ""}
                style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px 0" : "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: active ? "rgba(15,110,86,0.18)" : "transparent",
                  color: active ? "var(--brand-bright)" : "var(--text2)", fontFamily: "Inter", fontSize: 14.5, fontWeight: 500,
                  whiteSpace: "nowrap", width: "100%", textAlign: "left", transition: "background .12s" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover2)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ display: "flex", flex: "0 0 auto" }}>{ICONS[tab.id]}</span>
                {!collapsed && tab.label}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <button onClick={toggleTheme} title={collapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : ""} aria-label="Toggle theme"
          style={ghostBtn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <span style={{ display: "flex", flex: "0 0 auto" }}>{theme === "dark" ? SUN : MOON}</span>
          {!collapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
        </button>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setUploaded(false)}
          title={collapsed ? "Change data" : ""} aria-label="Change data"
          style={ghostBtn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <span style={{ display: "flex", flex: "0 0 auto" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4"/><polyline points="7 9 12 4 17 9"/><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/></svg>
          </span>
          {!collapsed && "Change data"}
        </motion.button>
      </aside>

      <main style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", padding: "28px 34px" }}>
        {page === "dashboard" && <Dashboard API={API} />}
        {page === "customers" && <Customers API={API} />}
        {page === "contacts"  && <Contacts API={API} />}
        {page === "journey"   && <Journey API={API} />}
        {page === "alerts"    && <Alerts API={API} />}
      </main>
    </div>
  );
}

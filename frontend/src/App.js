import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Alerts from "./pages/Alerts";
import Journey from "./pages/Journey";
import Lifecycle from "./pages/Lifecycle";
import "./App.css";

const API = "http://127.0.0.1:5000";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [alertCount, setAlertCount] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetch(`${API}/api/alerts`).then(r => r.json()).then(d => setAlertCount(d.count));
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "customers", label: "Customers", icon: "◈" },
    { id: "journey",   label: "Journey",   icon: "◎" },
    { id: "alerts",    label: "Alerts",    icon: "⬡", badge: alertCount },
    { id: "lifecycle", label: "Lifecycle", icon: "◉" },
  ];

  return (
    <div className="app">
      <div className="scanline" />
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">⚡</div>
          <div>
            <div className="logo-text">RETAINIQ</div>
            <div className="logo-sub">by Digital Move</div>
          </div>
        </div>
        <div className="header-right">
          <div style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", padding:"5px 14px", borderRadius:"999px" }}>
            <div style={{ width:"7px", height:"7px", background:"#10b981", borderRadius:"50%", boxShadow:"0 0 8px #10b981", flexShrink:0 }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"11px", fontWeight:"700", letterSpacing:"2px", color:"#10b981" }}>LIVE</span>
          </div>
          <div className="header-time">{time.toLocaleTimeString()}</div>
        </div>
      </header>

      <nav className="tab-nav">
        {tabs.map(tab => (
          <button key={tab.id} className={`tab-item ${page === tab.id ? "active" : ""}`} onClick={() => setPage(tab.id)}>
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="main">
        <div className="page-wrap">
          {page === "dashboard" && <Dashboard API={API} />}
          {page === "customers" && <Customers API={API} />}
          {page === "journey"   && <Journey API={API} />}
          {page === "alerts"    && <Alerts API={API} />}
          {page === "lifecycle" && <Lifecycle API={API} />}
        </div>
      </main>
    </div>
  );
}

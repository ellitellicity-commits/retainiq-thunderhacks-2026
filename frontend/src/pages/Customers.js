import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function CustomerDetail({ customer, onClose }) {
  const riskColor = getRiskColor(customer.churn_risk_score);
  const daysUntilExpiry = customer.days_until_expiry;
  const expiryColor = daysUntilExpiry < 0 ? "#ef4444" : daysUntilExpiry <= 30 ? "#ef4444" : daysUntilExpiry <= 90 ? "#f59e0b" : "#10b981";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "Space Mono", fontSize: 16, fontWeight: 700, color: "#e8f0fe" }}>{customer.client_name}</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginTop: 4 }}>
              {customer.vendor} · {customer.software}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{ background: "transparent", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#3d5070", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}
          >
            CLOSE ✕
          </motion.button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Contract Value", value: `$${customer.contract_value?.toLocaleString()}`, color: "#00e5ff" },
            { label: "Contract Start", value: customer.contract_start, color: "#7a8fb0" },
            { label: "Contract Expiry", value: customer.contract_expiry, color: expiryColor },
            { label: "Days Until Expiry", value: daysUntilExpiry < 0 ? "EXPIRED" : `${daysUntilExpiry} days`, color: expiryColor },
            { label: "Last Contact", value: customer.last_contact, color: "#7a8fb0" },
            { label: "Days Since Contact", value: `${customer.days_since_contact} days`, color: customer.days_since_contact > 60 ? "#f59e0b" : "#10b981" },
            { label: "Account Manager", value: customer.account_manager, color: "#8b5cf6" },
            { label: "Risk Score", value: `${customer.churn_risk_score}/100`, color: riskColor },
          ].map(s => (
            <div key={s.label} style={{ background: "#0d1526", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CustomerRow({ customer, index, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const riskColor = getRiskColor(customer.churn_risk_score);
  const initials = customer.client_name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?";
  const daysUntilExpiry = customer.days_until_expiry;
  const expiryColor = daysUntilExpiry < 0 ? "#ef4444" : daysUntilExpiry <= 30 ? "#ef4444" : daysUntilExpiry <= 90 ? "#f59e0b" : "#10b981";

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
      {/* Client name */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: riskColor, border: `1px solid ${riskColor}40`, background: `${riskColor}10`, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#e8f0fe" }}>{customer.client_name}</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070" }}>{customer.account_manager}</div>
          </div>
        </div>
      </td>

      {/* Vendor */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Space Mono", background: "rgba(0,229,255,0.08)", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.2)" }}>
          {customer.vendor}
        </span>
      </td>

      {/* Software */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", fontSize: 12, color: "#7a8fb0", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        {customer.software}
      </td>

      {/* Contract value */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", fontFamily: "Space Mono", fontSize: 13, color: "#e8f0fe", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <span style={{ color: "#00e5ff" }}>$</span>{customer.contract_value?.toLocaleString()}
      </td>

      {/* Expiry */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 12, color: expiryColor, fontWeight: 700 }}>
          {daysUntilExpiry < 0 ? "EXPIRED" : `${daysUntilExpiry}d`}
        </div>
        <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#3d5070", marginTop: 2 }}>{customer.contract_expiry}</div>
      </td>

      {/* Risk score */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 52, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${customer.churn_risk_score}%` }}
              transition={{ duration: 0.8, delay: index * 0.03 }}
              style={{ height: "100%", background: riskColor, borderRadius: 4 }}
            />
          </div>
          <span style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: riskColor, minWidth: 28 }}>
            {customer.churn_risk_score}
          </span>
          <span style={{ fontFamily: "Space Mono", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${riskColor}15`, color: riskColor, border: `1px solid ${riskColor}25` }}>
            {getRiskLabel(customer.churn_risk_score)}
          </span>
        </div>
      </td>

      {/* Stage */}
      <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(0,229,255,0.05)", background: isSelected ? "rgba(0,229,255,0.04)" : hovered ? "rgba(0,229,255,0.03)" : "transparent" }}>
        <span style={{ fontFamily: "Space Mono", fontSize: 10, fontWeight: 700, color: riskColor }}>
          {customer.journey_stage}
        </span>
      </td>
    </motion.tr>
  );
}

export default function Customers({ API }) {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("churn_risk_score");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    fetch(`${API}/api/customers`).then(r => r.json()).then(setCustomers);
  }, [API]);

  const vendors = ["all", ...new Set(customers.map(c => c.vendor))];

  const filtered = customers
    .filter(c => {
      const matchSearch = !search || c.client_name?.toLowerCase().includes(search.toLowerCase()) || c.vendor?.toLowerCase().includes(search.toLowerCase()) || c.software?.toLowerCase().includes(search.toLowerCase());
      const matchVendor = vendorFilter === "all" || c.vendor === vendorFilter;
      const matchRisk = riskFilter === "all" || (riskFilter === "high" && c.churn_risk_score > 70) || (riskFilter === "medium" && c.churn_risk_score >= 40 && c.churn_risk_score <= 70) || (riskFilter === "low" && c.churn_risk_score < 40);
      return matchSearch && matchVendor && matchRisk;
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
    <th onClick={() => toggleSort(col)} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "Space Mono", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sortBy === col ? "#00e5ff" : "#3d5070", borderBottom: "1px solid rgba(0,229,255,0.1)", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
      {label} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
          Client <span style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.5)" }}>Intelligence</span>
        </div>
        <div style={{ color: "#3d5070", fontSize: 12.5, marginTop: 5 }}>
          {customers.length} clients tracked · click any row to inspect
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#3d5070", fontSize: 13 }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients, vendors, software..." style={{ width: "100%", background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 9, padding: "8px 14px 8px 32px", fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#e8f0fe", outline: "none", boxSizing: "border-box" }} />
        </div>

        <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 9, padding: "8px 14px", fontFamily: "Space Mono", fontSize: 10, color: "#00e5ff", outline: "none", cursor: "pointer" }}>
          {vendors.map(v => <option key={v} value={v}>{v === "all" ? "All Vendors" : v}</option>)}
        </select>

        {[{ id: "all", label: "All Risk", color: "#00e5ff" }, { id: "high", label: "High", color: "#ef4444" }, { id: "medium", label: "Medium", color: "#f59e0b" }, { id: "low", label: "Low", color: "#10b981" }].map(f => (
          <motion.button key={f.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setRiskFilter(f.id)} style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${riskFilter === f.id ? f.color : "rgba(0,229,255,0.1)"}`, background: riskFilter === f.id ? `${f.color}15` : "transparent", color: riskFilter === f.id ? f.color : "#3d5070", fontFamily: "Space Mono", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s ease" }}>
            {f.label}
          </motion.button>
        ))}

        <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginLeft: "auto" }}>
          {filtered.length} RESULTS
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "#1a2236", border: "1px solid rgba(0,229,255,0.1)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0d1526" }}>
              <SortTh col="client_name" label="Client" />
              <SortTh col="vendor" label="Vendor" />
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "Space Mono", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#3d5070", borderBottom: "1px solid rgba(0,229,255,0.1)" }}>Software</th>
              <SortTh col="contract_value" label="Value" />
              <SortTh col="days_until_expiry" label="Expiry" />
              <SortTh col="churn_risk_score" label="Risk Score" />
              <SortTh col="journey_stage" label="Stage" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((c, i) => (
                <React.Fragment key={c.id}>
                  <CustomerRow customer={c} index={i} isSelected={selected?.id === c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} />
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
            NO CLIENTS MATCH YOUR FILTERS
          </div>
        )}
      </motion.div>
    </div>
  );
}

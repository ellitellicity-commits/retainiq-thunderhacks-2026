import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUICK_ACTIONS } from "../data/mockData";

const SEARCHABLE = [
  { type: "client", label: "TD Bank", subtitle: "Client • Negotiation • $150K", page: "customers" },
  { type: "client", label: "Bell Canada", subtitle: "Client • Negotiation • $520K", page: "customers" },
  { type: "client", label: "RBC Bank", subtitle: "Client • Quote Sent • $200K", page: "customers" },
  { type: "client", label: "Loblaw Companies", subtitle: "Client • Demo • $180K", page: "customers" },
  { type: "client", label: "Sun Life Financial", subtitle: "Client • Quote Sent • $340K", page: "customers" },
  { type: "contact", label: "Aisha Khan", subtitle: "Contact • CFO at TD Bank", page: "contacts" },
  { type: "contact", label: "Marcus Reid", subtitle: "Contact • VP Technology at RBC", page: "contacts" },
  { type: "contact", label: "James Morrison", subtitle: "Contact • VP Security at Bell Canada", page: "contacts" },
  { type: "contact", label: "Priya Sharma", subtitle: "Contact • Dir. Engineering at Loblaw", page: "contacts" },
  { type: "deal", label: "TD Bank Enterprise Expansion", subtitle: "Deal • Negotiation • $150K", page: "journey" },
  { type: "deal", label: "Bell Canada Security Platform", subtitle: "Deal • Negotiation • $520K", page: "journey" },
  { type: "deal", label: "RBC Bank Renewal", subtitle: "Deal • Quote Sent • $200K", page: "journey" },
  { type: "page", label: "Dashboard", subtitle: "Navigate to Dashboard", page: "dashboard" },
  { type: "page", label: "Pipeline", subtitle: "Navigate to Pipeline", page: "journey" },
  { type: "page", label: "Analytics", subtitle: "Navigate to Analytics", page: "alerts" },
  { type: "page", label: "AI Co-pilot", subtitle: "Navigate to AI Co-pilot", page: "copilot" },
  { type: "page", label: "Tasks", subtitle: "Navigate to Tasks", page: "tasks" },
  { type: "page", label: "Email Sequences", subtitle: "Navigate to Sequences", page: "sequences" },
  { type: "page", label: "Automations", subtitle: "Navigate to Automations", page: "automations" },
];

const TYPE_ORDER = ["action", "client", "contact", "deal", "page"];
const TYPE_LABELS = {
  action: "Actions",
  client: "Clients",
  contact: "Contacts",
  deal: "Deals",
  page: "Pages",
};

function getIcon(type, iconField) {
  const iconStyle = {
    width: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text2)",
    flexShrink: 0,
  };

  if (type === "action") {
    switch (iconField) {
      case "plus":
        return <span style={iconStyle}>+</span>;
      case "check":
        return (
          <span style={iconStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 8 7 12 13 4" />
            </svg>
          </span>
        );
      case "edit":
        return (
          <span style={iconStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2l3 3L5 14H2v-3L11 2z" />
            </svg>
          </span>
        );
      case "sparkle":
        return (
          <span style={{ ...iconStyle, color: "var(--cyan)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0l1.5 5.5L15 8l-5.5 1.5L8 15l-1.5-5.5L1 8l5.5-1.5L8 0z" />
            </svg>
          </span>
        );
      case "search":
        return (
          <span style={iconStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="7" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
          </span>
        );
      default:
        return <span style={iconStyle}>*</span>;
    }
  }

  if (type === "client") {
    return (
      <span style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="2" width="10" height="12" rx="1" />
          <line x1="6" y1="5" x2="10" y2="5" />
          <line x1="6" y1="8" x2="10" y2="8" />
          <line x1="6" y1="11" x2="8" y2="11" />
        </svg>
      </span>
    );
  }

  if (type === "contact") {
    return (
      <span style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="5" r="3" />
          <path d="M2 14c0-3 3-5 6-5s6 2 6 5" />
        </svg>
      </span>
    );
  }

  if (type === "deal") {
    return (
      <span style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="1" x2="8" y2="15" />
          <path d="M11 4H6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H5" />
        </svg>
      </span>
    );
  }

  if (type === "page") {
    return (
      <span style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="8" x2="12" y2="8" />
          <polyline points="9 5 12 8 9 11" />
        </svg>
      </span>
    );
  }

  return <span style={iconStyle}>*</span>;
}

export default function CommandPalette({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const flatResults = useMemo(() => {
    if (!query.trim()) {
      const actions = QUICK_ACTIONS.map((a) => ({
        type: "action",
        label: a.label,
        subtitle: a.shortcut ? `Shortcut: ${a.shortcut}` : "",
        page: a.id === "copilot" ? "copilot" : null,
        icon: a.icon,
        id: a.id,
      }));
      return actions;
    }

    const q = query.toLowerCase();
    const filtered = SEARCHABLE.filter((item) =>
      item.label.toLowerCase().includes(q)
    );

    const grouped = [];
    for (const type of TYPE_ORDER) {
      const items = filtered.filter((item) => item.type === type);
      for (const item of items) {
        grouped.push(item);
      }
    }
    return grouped;
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups = [];
    let currentType = null;
    for (let i = 0; i < flatResults.length; i++) {
      const item = flatResults[i];
      if (item.type !== currentType) {
        currentType = item.type;
        groups.push({ type: "header", label: TYPE_LABELS[item.type] || item.type });
      }
      groups.push({ ...item, flatIndex: i });
    }
    return groups;
  }, [flatResults]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatResults[activeIndex];
        if (selected) {
          if (selected.id) {
            onNavigate({ action: selected.id });
          } else if (selected.page) {
            onNavigate(selected.page);
          }
          onClose();
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, flatResults, onClose, onNavigate]);

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "15vh",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 620,
              background: "var(--card)",
              borderRadius: 16,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "60vh",
            }}
          >
            {/* Search input */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="var(--text3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="9" cy="9" r="6" />
                <line x1="14" y1="14" x2="18" y2="18" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or type a command..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  color: "var(--text)",
                  fontFamily: "inherit",
                }}
              />
              <kbd
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "var(--bg)",
                  border: "1px solid var(--border2)",
                  color: "var(--text3)",
                  fontFamily: "inherit",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{
                overflowY: "auto",
                padding: "8px 0",
                flex: 1,
              }}
            >
              {flatResults.length === 0 && (
                <div
                  style={{
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "var(--text3)",
                    fontSize: 14,
                  }}
                >
                  No results found
                </div>
              )}

              {groupedResults.map((item, i) => {
                if (item.type === "header") {
                  return (
                    <div
                      key={`header-${item.label}-${i}`}
                      style={{
                        padding: "8px 20px 4px",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text3)",
                      }}
                    >
                      {item.label}
                    </div>
                  );
                }

                const isActive = item.flatIndex === activeIndex;

                return (
                  <div
                    key={`${item.type}-${item.label}-${i}`}
                    data-index={item.flatIndex}
                    onClick={() => {
                      if (item.id) {
                        onNavigate({ action: item.id });
                        onClose();
                      } else if (item.page) {
                        onNavigate(item.page);
                        onClose();
                      }
                    }}
                    onMouseEnter={() => setActiveIndex(item.flatIndex)}
                    style={{
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      background: isActive ? "var(--hover2)" : "transparent",
                      transition: "background 0.1s",
                    }}
                  >
                    {getIcon(item.type, item.icon)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </div>
                      {item.subtitle && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text3)",
                            marginTop: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <kbd
                        style={{
                          fontSize: 11,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "var(--bg)",
                          border: "1px solid var(--border2)",
                          color: "var(--text3)",
                          fontFamily: "inherit",
                          flexShrink: 0,
                        }}
                      >
                        ↵
                      </kbd>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer with keyboard hints */}
            <div
              style={{
                padding: "10px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 11,
                color: "var(--text3)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <kbd
                  style={{
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: "var(--bg)",
                    border: "1px solid var(--border2)",
                    fontFamily: "inherit",
                  }}
                >
                  ↑↓
                </kbd>
                navigate
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <kbd
                  style={{
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: "var(--bg)",
                    border: "1px solid var(--border2)",
                    fontFamily: "inherit",
                  }}
                >
                  ↵
                </kbd>
                select
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <kbd
                  style={{
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: "var(--bg)",
                    border: "1px solid var(--border2)",
                    fontFamily: "inherit",
                  }}
                >
                  esc
                </kbd>
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

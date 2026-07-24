import React, { useState } from "react";

const typeConfig = {
  email: { color: "var(--cyan)", icon: "✉" },
  call: { color: "var(--green)", icon: "☎" },
  meeting: { color: "var(--purple)", icon: "📅" },
  note: { color: "var(--amber)", icon: "✏" },
  deal_stage_change: { color: "var(--blue)", icon: "→" },
  contact_added: { color: "var(--green)", icon: "＋" },
  contact_updated: { color: "var(--blue)", icon: "✎" },
  contact_deleted: { color: "var(--red)", icon: "×" },
  quote_created: { color: "var(--amber)", icon: "▤" },
  quote_sent: { color: "var(--green)", icon: "▤" },
};

const filters = [
  { key: "all", label: "All" },
  { key: "email", label: "Emails" },
  { key: "call", label: "Calls" },
  { key: "meeting", label: "Meetings" },
  { key: "deal_stage_change", label: "Deals" },
  { key: "quote_created", label: "Quotes" },
];

function getRelativeTime(dateStr) {
  const now = new Date();
  // A bare "YYYY-MM-DD" string parses as UTC midnight per spec, which can
  // read many hours off from "now" depending on the browser's timezone.
  // Appending a time makes it parse as local midnight instead.
  const hasTime = /\d{2}:\d{2}/.test(dateStr || "");
  const date = new Date(hasTime ? dateStr : `${dateStr}T00:00:00`);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) return `${Math.floor(diffDay / 30)} months ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffMin > 0) return `${diffMin} min ago`;
  return "just now";
}

export default function ActivityTimeline({ activities = [], maxItems = 10 }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  const filtered =
    activeFilter === "all"
      ? activities
      : activities.filter((a) => a.type === activeFilter);

  const visible = filtered.slice(0, maxItems);

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px",
      }}
    >
      {/* Filter pills */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 500,
              border:
                activeFilter === f.key
                  ? "1px solid var(--brand-bright)"
                  : "1px solid var(--border2)",
              borderRadius: "999px",
              background:
                activeFilter === f.key ? "var(--brand-bright)" : "transparent",
              color: activeFilter === f.key ? "#fff" : "var(--text2)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: "24px" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "9px",
            top: "8px",
            bottom: "8px",
            width: "2px",
            background: "var(--border2)",
            borderRadius: "1px",
          }}
        />

        {visible.length === 0 && (
          <div style={{ color: "var(--text3)", fontSize: "13px", padding: "8px 0" }}>
            No activities to show.
          </div>
        )}

        {visible.map((activity) => {
          const config = typeConfig[activity.type] || typeConfig.note;
          const isHovered = hoveredId === activity.id;

          return (
            <div
              key={activity.id}
              onMouseEnter={() => setHoveredId(activity.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 8px",
                borderRadius: "var(--radius)",
                background: isHovered ? "var(--hover2)" : "transparent",
                transition: "background 0.15s ease",
                position: "relative",
              }}
            >
              {/* Circle icon */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: config.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  flexShrink: 0,
                  marginLeft: "-16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text)",
                    lineHeight: "1.3",
                  }}
                >
                  {activity.title}
                </div>

                {activity.description && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text2)",
                      lineHeight: "1.4",
                      marginTop: "2px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {activity.description}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "var(--text3)",
                  }}
                >
                  {activity.user && <span>{activity.user}</span>}
                  {(activity.loggedAt || activity.date) && <span>{getRelativeTime(activity.loggedAt || activity.date)}</span>}
                  {activity.duration && <span>{activity.duration}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

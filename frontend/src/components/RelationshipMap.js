import React, { useState } from "react";

function getWarmthColor(warmth) {
  if (warmth > 0.7) return "var(--green)";
  if (warmth >= 0.4) return "var(--amber)";
  return "var(--red)";
}

function getInfluenceSize(influence) {
  switch (influence) {
    case "high":
      return 24;
    case "medium":
      return 18;
    case "low":
      return 14;
    default:
      return 18;
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RelationshipMap({ data }) {
  const [hoveredContact, setHoveredContact] = useState(null);

  if (!data) return null;

  const { company, contacts } = data;
  const svgWidth = 480;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const orbitRadius = 130;
  const companyNodeRadius = 36;

  const contactPositions = contacts.map((contact, i) => {
    const angle = (2 * Math.PI * i) / contacts.length - Math.PI / 2;
    return {
      ...contact,
      x: centerX + orbitRadius * Math.cos(angle),
      y: centerY + orbitRadius * Math.sin(angle),
      radius: getInfluenceSize(contact.influence),
    };
  });

  return (
    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        {/* Connection lines */}
        {contactPositions.map((contact, i) => (
          <line
            key={`line-${i}`}
            x1={centerX}
            y1={centerY}
            x2={contact.x}
            y2={contact.y}
            stroke={getWarmthColor(contact.warmth)}
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray={contact.warmth < 0.4 ? "4 3" : "none"}
          />
        ))}

        {/* Company center node */}
        <circle
          cx={centerX}
          cy={centerY}
          r={companyNodeRadius}
          fill="var(--cyan)"
          opacity={0.9}
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={700}
          letterSpacing="0.02em"
        >
          {company.length > 12 ? company.slice(0, 11) + "..." : company}
        </text>

        {/* Contact nodes */}
        {contactPositions.map((contact, i) => (
          <g
            key={`contact-${i}`}
            onMouseEnter={() => setHoveredContact(i)}
            onMouseLeave={() => setHoveredContact(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Outer ring for warmth indication */}
            <circle
              cx={contact.x}
              cy={contact.y}
              r={contact.radius + 3}
              fill="none"
              stroke={getWarmthColor(contact.warmth)}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
            {/* Node circle */}
            <circle
              cx={contact.x}
              cy={contact.y}
              r={contact.radius}
              fill="var(--card)"
              stroke={getWarmthColor(contact.warmth)}
              strokeWidth={1.5}
            />
            {/* Initials */}
            <text
              x={contact.x}
              y={contact.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text)"
              fontSize={contact.radius * 0.7}
              fontWeight={600}
            >
              {getInitials(contact.name)}
            </text>
            {/* Name label below node */}
            <text
              x={contact.x}
              y={contact.y + contact.radius + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text2)"
              fontSize={10}
              fontWeight={500}
            >
              {contact.name.split(" ")[0]}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredContact !== null && (
        <div
          style={{
            position: "absolute",
            top: contactPositions[hoveredContact].y - 10,
            left: contactPositions[hoveredContact].x + contactPositions[hoveredContact].radius + 12,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            zIndex: 10,
            pointerEvents: "none",
            minWidth: 160,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            {contacts[hoveredContact].name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>
            {contacts[hoveredContact].role}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Warmth:</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: getWarmthColor(contacts[hoveredContact].warmth),
              }}
            >
              {Math.round(contacts[hoveredContact].warmth * 100)}%
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>
            Last contact: {contacts[hoveredContact].lastContact} days ago
          </div>
        </div>
      )}
    </div>
  );
}

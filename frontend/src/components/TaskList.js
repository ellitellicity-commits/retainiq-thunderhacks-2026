import React from "react";

export default function TaskList({ tasks = [], onToggle }) {
  const priorityColor = (p) => {
    switch (p) {
      case "critical": return "var(--red)";
      case "high": return "var(--amber)";
      case "medium": return "var(--blue)";
      default: return "var(--text3)";
    }
  };

  const typeIcon = (type) => {
    switch (type) {
      case "call": return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
      case "email": case "follow-up": return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
      case "meeting": return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
      case "document": case "preparation": return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
      default: return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((d - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `In ${diff} days`;
  };

  const isOverdue = (dateStr, completed) => {
    if (completed) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {tasks.map(task => (
        <div key={task.id}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", opacity: task.completed ? 0.6 : 1 }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--hover2)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--card)"}>
          <button onClick={() => onToggle && onToggle(task.id)}
            style={{ width: 20, height: 20, borderRadius: 6, border: task.completed ? "none" : `2px solid ${priorityColor(task.priority)}`, background: task.completed ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            {task.completed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", textDecoration: task.completed ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {task.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text3)" }}>
                {typeIcon(task.type)}
                {task.linkedDeal}
              </span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>&middot;</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{task.assignee}</span>
            </div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: isOverdue(task.dueDate, task.completed) ? "var(--red)" : "var(--text3)" }}>
              {task.completed ? "Done" : formatDate(task.dueDate)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: priorityColor(task.priority) }} />
              <span style={{ fontSize: 10, color: "var(--text3)", textTransform: "capitalize" }}>{task.priority}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

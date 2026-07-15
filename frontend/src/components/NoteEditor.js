import React, { useState } from "react";

export default function NoteEditor({ notes = [], entityId, entityType = "client" }) {
  const [localNotes, setLocalNotes] = useState(notes.filter(n => n.entityType === entityType && n.entityId === entityId));
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSave = () => {
    if (!newNote.trim()) return;
    setLocalNotes(prev => [{
      id: Date.now(),
      entityType,
      entityId,
      content: newNote.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
    }, ...prev]);
    setNewNote("");
    setAdding(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      {!adding ? (
        <button onClick={() => setAdding(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border2)", background: "transparent", color: "var(--brand-bright)", fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 16 }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--hover2)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add note
        </button>
      ) : (
        <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: "1px solid var(--border2)", background: "var(--bg)" }}>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Write a note..."
            autoFocus
            style={{ width: "100%", minHeight: 80, border: "none", background: "transparent", color: "var(--text)", fontSize: 13, fontFamily: "Inter", resize: "vertical", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => { setAdding(false); setNewNote(""); }}
              style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border2)", background: "transparent", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleSave}
              style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "var(--cyan)", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: newNote.trim() ? 1 : 0.5 }}>
              Save note
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {localNotes.length === 0 && !adding && (
          <div style={{ fontSize: 13, color: "var(--text3)", textAlign: "center", padding: 20 }}>No notes yet</div>
        )}
        {localNotes.map(note => (
          <div key={note.id} style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }}>
            <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{note.content}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
              <span style={{ fontWeight: 500 }}>{note.author}</span>
              <span>&middot;</span>
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

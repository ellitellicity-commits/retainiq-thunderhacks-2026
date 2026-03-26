import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Upload({ onUpload, onSkip, API }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (!f.name.endsWith(".csv")) {
      setError("Please upload a CSV file!");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        onUpload();
      }
    } catch (e) {
      setError("Upload failed. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#1a2236",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 0 60px rgba(0,229,255,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 18, fontWeight: 700, color: "#e8f0fe" }}>
            Upload Client Data
          </div>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", letterSpacing: 1.5, marginTop: 8 }}>
            CSV must include: name, plan, spend, logins, days_since_contact, support_tickets, contract_months
          </div>
        </div>

        {/* Drop zone */}
        <motion.div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          animate={{ borderColor: dragging ? "#00e5ff" : file ? "#10b981" : "rgba(0,229,255,0.15)" }}
          style={{
            border: "2px dashed rgba(0,229,255,0.15)",
            borderRadius: 14,
            padding: "40px 20px",
            textAlign: "center",
            marginBottom: 20,
            cursor: "pointer",
            transition: "border-color 0.2s ease",
          }}
          onClick={() => document.getElementById("csv-input").click()}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {file ? (
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 12, color: "#10b981" }}>{file.name}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#3d5070", marginTop: 4 }}>Click to change file</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 12, color: "#3d5070" }}>
                Drop your CSV here or click to browse
              </div>
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: "#ef4444", fontFamily: "Space Mono", fontSize: 11, marginBottom: 16, textAlign: "center" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,229,255,0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            width: "100%",
            background: !file ? "rgba(0,229,255,0.05)" : "rgba(0,229,255,0.15)",
            border: "1px solid rgba(0,229,255,0.3)",
            borderRadius: 10,
            padding: "13px",
            color: !file ? "#3d5070" : "#00e5ff",
            fontFamily: "Space Mono",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: !file || loading ? "not-allowed" : "pointer",
            marginBottom: 12,
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "ANALYZING DATA..." : "UPLOAD & ANALYZE →"}
        </motion.button>


      </motion.div>
    </div>
  );
}

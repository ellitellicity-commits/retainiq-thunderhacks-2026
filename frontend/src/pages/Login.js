import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === "digitalmove" && password === "retainiq2026") {
        onLogin();
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
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
          maxWidth: 420,
          boxShadow: "0 0 60px rgba(0,229,255,0.08)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚡</div>
          <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#e8f0fe", letterSpacing: -0.3 }}>
            RETAINIQ
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "#3d5070", letterSpacing: 2, marginTop: 4 }}>
            BY DIGITAL MOVE
          </div>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "#3d5070", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            Username
          </div>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{
              width: "100%",
              background: "#0d1526",
              border: "1px solid rgba(0,229,255,0.12)",
              borderRadius: 10,
              padding: "12px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#e8f0fe",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(0,229,255,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(0,229,255,0.12)"}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "#3d5070", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            Password
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              background: "#0d1526",
              border: "1px solid rgba(0,229,255,0.12)",
              borderRadius: 10,
              padding: "12px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#e8f0fe",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(0,229,255,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(0,229,255,0.12)"}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "#ef4444", fontFamily: "Inter", fontSize: 11, marginBottom: 16, textAlign: "center" }}
          >
            {error}
          </motion.div>
        )}

        {/* Login button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,229,255,0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          style={{
            width: "100%",
            background: loading ? "rgba(0,229,255,0.1)" : "rgba(0,229,255,0.15)",
            border: "1px solid rgba(0,229,255,0.3)",
            borderRadius: 10,
            padding: "13px",
            color: "#00e5ff",
            fontFamily: "Inter",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "AUTHENTICATING..." : "LOGIN →"}
        </motion.button>

        <div style={{ textAlign: "center", marginTop: 24, fontFamily: "Inter", fontSize: 10, color: "#3d5070" }}>
          Powered by RetainIQ · Digital Move IT & Telecom
        </div>
      </motion.div>
    </div>
  );
}

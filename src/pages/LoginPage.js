// src/pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import PexelsPhotoWall from "../components/PexelsPhotoWall";

// Google Fonts import for Alumni Sans Pinstripe
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Alumni+Sans+Pinstripe&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Animated security message logic
  const messages = [
    "Fotoğraflarınız bizimle güvende.",
    "Videolarınız bizimle güvende.",
    "Belgeleriniz bizimle güvende.",
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayed, setDisplayed] = useState(messages[0]);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (displayed.length < messages[msgIndex].length) {
        timeout = setTimeout(() => {
          setDisplayed(messages[msgIndex].slice(0, displayed.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 30);
      } else {
        setTyping(true);
        setMsgIndex((i) => (i + 1) % messages.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, msgIndex, messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Giriş Hatası Detayları:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("E-posta veya şifre hatalı.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi formatı.");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "row",
        background: theme.background,
        color: theme.text,
        transition: "all 0.3s ease",
        padding: 0,
        margin: 0,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Left: Animated text + Login form */}
      <div
        style={{
          flexBasis: "60%",
          maxWidth: "60vw",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "40px 0 0 0",
          minHeight: 0,
        }}
      >
        {/* Animated security message */}
        <div
          style={{
            fontSize: window.innerWidth < 700 ? "6vw" : "64px",
            fontWeight: 900,
            marginBottom: 40,
            minHeight: 60,
            letterSpacing: 1,
            textAlign: "left",
            color: "transparent",
            transition: "all 0.3s ease",
            fontFamily:
              "Alumni Sans Pinstripe, Inter, Segoe UI, Arial, sans-serif",
            maxWidth: 800,
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "visible",
            background: "linear-gradient(90deg, #4b82ef 0%, #d56676 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            lineHeight: 1.1,
            wordBreak: "break-word",
            paddingLeft: 40,
            boxSizing: "border-box",
          }}
        >
          <span id="security-animated-text">{displayed}&nbsp;</span>
        </div>
        {/* Login form */}
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            background: theme.surface,
            borderRadius: 16,
            boxShadow: theme.shadow,
            padding: 32,
            margin: 0,
            color: theme.text,
            transition: "all 0.3s ease",
            minHeight: 340,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 style={{ color: theme.text, textAlign: "center" }}>Giriş Yap</h2>
          {error && (
            <p
              style={{
                color: theme.error,
                border: `1px solid ${theme.error}`,
                padding: "10px",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: theme.text,
                }}
              >
                E-posta:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  background: theme.background,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  fontSize: "1.1em",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: theme.text,
                }}
              >
                Şifre:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  background: theme.background,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  fontSize: "1.1em",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? theme.border : theme.primary,
                color: theme.text,
                border: "none",
                borderRadius: 8,
                fontSize: "1.1em",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <span style={{ color: theme.text }}>Hesabın yok mu? </span>
            <Link
              to="/signup"
              style={{ color: theme.primary, fontWeight: 500 }}
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
      {/* Right: Photo wall */}
      <div
        style={{
          flexBasis: "40%",
          maxWidth: "40vw",
          minWidth: 0,
          height: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: theme.surface,
          overflow: "hidden",
          transition: "all 0.3s ease",
          padding: 0,
          margin: 0,
          position: "fixed",
          right: 0,
          top: 0,
          zIndex: 1,
          boxShadow: "-4px 0 24px 0 rgba(0,0,0,0.08)",
        }}
      >
        <PexelsPhotoWall apiKey={PEXELS_API_KEY} />
      </div>
    </div>
  );
}

export default LoginPage;

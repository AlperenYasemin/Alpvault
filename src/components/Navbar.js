// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // AuthContext'ten hook'umuzu alıyoruz.
import { useTheme } from "../contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  const { currentUser, logout } = useAuth(); // currentUser (giriş yapmış kullanıcı) ve logout fonksiyonunu çekiyoruz.
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function handleLogout() {
    try {
      await logout(); // AuthContext'teki logout fonksiyonunu çağır.
      navigate("/login"); // Başarılı çıkış sonrası kullanıcıyı giriş sayfasına yönlendir.
    } catch (error) {
      console.error("Çıkış Hatası:", error);
      // İsteğe bağlı: Kullanıcıya bir hata mesajı gösterebilirsin.
      alert("Çıkış yapılamadı. Lütfen tekrar deneyin.");
    }
  }

  return (
    <nav
      style={{
        background: theme.surface,
        padding: "16px 24px",
        boxShadow: theme.shadow,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          color: "#1976d2",
          fontSize: "1.5em",
          fontWeight: "bold",
          letterSpacing: 1,
          fontFamily: "Inter, Segoe UI, Arial, sans-serif",
          transition: "all 0.3s ease",
        }}
      >
        AlpVault
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <ThemeToggle />
        {currentUser ? (
          // Kullanıcı giriş yapmışsa (currentUser null değilse):
          <>
            <span
              style={{
                marginRight: 18,
                fontStyle: "italic",
                color: "#bbb",
                fontSize: "1.15em",
              }}
            >
              Hoş geldin, {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: 600,
              }}
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          // Kullanıcı giriş yapmamışsa (currentUser null ise):
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                marginRight: 10,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 22px",
                fontWeight: 500,
                fontSize: "1.1em",
                cursor: "pointer",
                boxShadow: "0 1px 4px #0002",
              }}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 22px",
                fontWeight: 500,
                fontSize: "1.1em",
                cursor: "pointer",
                boxShadow: "0 1px 4px #0002",
                marginLeft: 4,
              }}
            >
              Kayıt Ol
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

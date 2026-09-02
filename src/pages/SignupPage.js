// src/pages/SignupPage.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // AuthContext'ten useAuth hook'umuzu alıyoruz.
import { useNavigate, Link } from "react-router-dom"; // Yönlendirme ve Link için.
import { useTheme } from "../contexts/ThemeContext";

function SignupPage() {
  // Form alanları için state'ler:
  const [email, setEmail] = useState(""); // E-posta input'unun değerini tutar.
  const [password, setPassword] = useState(""); // Şifre input'unun değerini tutar.

  // Hata ve yükleme durumları için state'ler:
  const [error, setError] = useState(""); // Hata mesajını tutar.
  const [loading, setLoading] = useState(false); // İşlem sırasında butonu pasif yapmak için.

  const { signup } = useAuth(); // useAuth() hook'u ile AuthContext'ten signup fonksiyonunu çekiyoruz.
  const navigate = useNavigate(); // Programatik olarak başka sayfalara yönlendirme yapmak için.
  const { theme } = useTheme();

  // Form gönderildiğinde çalışacak fonksiyon:
  async function handleSubmit(e) {
    e.preventDefault(); // Formun varsayılan gönderme davranışını (sayfayı yenileme) engeller.

    // Şifrelerin eşleşip eşleşmediğini kontrol etmek gibi ek doğrulamalar buraya eklenebilir.
    // Örneğin, bir "Şifre Tekrar" alanı ekleyip kontrol edebilirsin. Prototip için şimdilik atlıyoruz.

    try {
      setError(""); // Varsa bir önceki hata mesajını temizle.
      setLoading(true); // Butonu pasif hale getirmek ve "Kaydediliyor..." göstermek için.
      await signup(email, password); // AuthContext'teki signup fonksiyonunu çağırıyoruz.
      // Bu asenkron bir işlem olduğu için 'await' kullanıyoruz.
      navigate("/"); // Kayıt başarılı olursa kullanıcıyı ana sayfaya ('/') yönlendir.
    } catch (err) {
      console.error("Kayıt Hatası Detayları:", err); // Geliştirme sırasında hatayı konsolda görmek için.
      // Kullanıcıya daha anlaşılır bir hata mesajı göster:
      if (err.code === "auth/email-already-in-use") {
        setError("Bu e-posta adresi zaten kullanılıyor.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi formatı.");
      } else if (err.code === "auth/weak-password") {
        setError("Şifre çok zayıf. En az 6 karakter olmalı.");
      } else {
        setError("Hesap oluşturulamadı. Lütfen tekrar deneyin.");
      }
    }
    setLoading(false); // İşlem bittiğinde (başarılı veya başarısız) yükleme durumunu false yap.
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        color: theme.text,
        transition: "all 0.3s ease",
      }}
    >
      <h2 style={{ color: theme.text }}>Kayıt Ol</h2>
      {error && (
        <p
          style={{
            color: theme.error,
            border: `1px solid ${theme.error}`,
            padding: "10px",
          }}
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", color: theme.text }}
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
              background: theme.surface,
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
            style={{ display: "block", marginBottom: "5px", color: theme.text }}
          >
            Şifre:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              background: theme.surface,
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
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <span style={{ color: theme.text }}>Zaten bir hesabın var mı? </span>
        <Link to="/login" style={{ color: theme.primary, fontWeight: 500 }}>
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}

export default SignupPage;

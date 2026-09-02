// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext"; // Oluşturduğumuz AuthProvider'ı import ediyoruz.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* App komponentimizi AuthProvider ile sarıyoruz */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

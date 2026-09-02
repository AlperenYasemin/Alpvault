import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themes = {
  dark: {
    background: "#18191a",
    surface: "#23272f",
    primary: "#1976d2",
    text: "#ffffff",
    textSecondary: "#61dafb",
    border: "#333333",
    shadow: "0 2px 8px #0004",
    hover: "#26324a",
    error: "#ff5252",
    success: "#28a745",
    cardBackground: "#23272f",
    cardBorder: "#333333",
  },
  light: {
    background: "#f5f5f5",
    surface: "#ffffff",
    primary: "#1976d2",
    text: "#333333",
    textSecondary: "#1976d2",
    border: "#e0e0e0",
    shadow: "0 2px 8px #0001",
    hover: "#f0f0f0",
    error: "#ff5252",
    success: "#28a745",
    cardBackground: "#ffffff",
    cardBorder: "#e0e0e0",
  },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
    document.body.style.transition = "background-color 0.3s ease";
    document.body.style.backgroundColor = isDark
      ? themes.dark.background
      : themes.light.background;
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

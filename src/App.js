// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FileList from "./components/FileList";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SharePage from "./pages/SharePage";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div
            className="container"
            style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
          >
            <Routes>
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<FileList />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/share/:shareId" element={<SharePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

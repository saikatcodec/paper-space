import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProfilePage from "./Profile/index";
import HomePage from "./Home/index";
import Navbar from "./components/Navbar";
import PublicationsPage from "./Publications/index";
import ProjectsPage from "./Projects/index";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Admin/Dashboard";
import Crawler from "./Admin/Crawler";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <ProfilePage />
              </>
            }
          />
          <Route
            path="/publications"
            element={
              <>
                <Navbar />
                <PublicationsPage />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Navbar />
                <ProjectsPage />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/crawler"
            element={
              <ProtectedRoute>
                <Crawler />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

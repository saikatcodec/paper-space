import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProfilePage from "./Profile/index";
import HomePage from "./Home/index";
import Navbar from "./components/Navbar";
import PublicationsPage from "./Publications/index";
import ProjectsPage from "./Projects/index";

// Admin components
import AdminLayout from "./Admin/components/AdminLayout";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Admin/Dashboard";
import Crawler from "./Admin/Crawler";
import PublicationsManager from "./Admin/PublicationsManager";
import PublicationEditor from "./Admin/PublicationEditor";
import ProfileEditor from "./Admin/ProfileEditor";
import Settings from "./Admin/Settings";

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

          <Route
            path="/admin/publications"
            element={
              <ProtectedRoute>
                <PublicationsManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/publications/add"
            element={
              <ProtectedRoute>
                <PublicationEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/publications/edit/:id"
            element={
              <ProtectedRoute>
                <PublicationEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile-editor"
            element={
              <ProtectedRoute>
                <ProfileEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

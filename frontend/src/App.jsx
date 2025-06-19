import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProfilePage from "./Profile/index";
import HomePage from "./Home/index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the Footer component
import PublicationsPage from "./Publications/index";
import ProjectsPage from "./Projects/index";
import PublicationDetail from "./Publications/PublicationDetail";
import NewsList from "./News/NewsList";
import NewsDetail from "./News/NewsDetail";
import NotFound from "./components/NotFound"; // Import the NotFound component

// Admin components
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Admin/Dashboard";
import Crawler from "./Admin/Crawler";
import PublicationsManager from "./Admin/PublicationsManager";
import PublicationEditor from "./Admin/PublicationEditor";
import ProfileEditor from "./Admin/ProfileEditor";
import Settings from "./Admin/Settings";
import NewsManager from "./Admin/NewsManager";
import NewsEditor from "./Admin/NewsEditor";

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
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <ProfilePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/publications"
            element={
              <>
                <Navbar />
                <PublicationsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/publications/:id"
            element={
              <>
                <Navbar />
                <PublicationDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Navbar />
                <ProjectsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/news"
            element={
              <>
                <Navbar />
                <NewsList />
                <Footer />
              </>
            }
          />
          <Route
            path="/news/:id"
            element={
              <>
                <Navbar />
                <NewsDetail />
                <Footer />
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

          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <NewsManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/add"
            element={
              <ProtectedRoute>
                <NewsEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/edit/:id"
            element={
              <ProtectedRoute>
                <NewsEditor />
              </ProtectedRoute>
            }
          />

          {/* 404 Route - This should be the last route */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <NotFound />
                <Footer />
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

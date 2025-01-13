import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProfilePage from "./Profile/index";
import HomePage from "./Home/index";
import Navbar from "./components/Navbar";
import PublicationsPage from "./Publications/index";
import ProjectsPage from "./Projects/index";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

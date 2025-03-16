import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">PaperSpace Admin</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              Publications
            </h2>
            <p className="text-gray-700 mb-4">
              Manage research publications in the system.
            </p>
            <Link
              to="/admin/publications"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded block text-center"
            >
              Manage Publications
            </Link>
          </div>

          <div className="bg-white p-6 rounded shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Profile</h2>
            <p className="text-gray-700 mb-4">
              Update profile information and details.
            </p>
            <Link
              to="/admin/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded block text-center"
            >
              Edit Profile
            </Link>
          </div>

          <div className="bg-white p-6 rounded shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Crawl Data</h2>
            <p className="text-gray-700 mb-4">
              Fetch new publications from research platforms.
            </p>
            <Link
              to="/admin/crawler"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded block text-center"
            >
              Start Crawler
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

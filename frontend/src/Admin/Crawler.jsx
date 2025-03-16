import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Crawler = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { refreshToken } = useAuth();

  const fetchPublications = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/add_all_research",
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`Successfully added ${response.data.size} new publications`);
    } catch (err) {
      if (err.response?.status === 401) {
        // Try to refresh the token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request with the new token
          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
              "http://127.0.0.1:8000/admin/add_all_research",
              { url },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setMessage(
              `Successfully added ${response.data.size} new publications`
            );
          } catch (retryErr) {
            setError(
              retryErr.response?.data?.detail || "Failed to fetch publications"
            );
          }
        } else {
          setError("Authentication failed. Please log in again.");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to fetch publications");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Publication Crawler</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={fetchPublications}>
          <div className="mb-4">
            <label
              htmlFor="url"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              ResearchGate Profile URL (Optional)
            </label>
            <input
              type="text"
              id="url"
              placeholder="https://www.researchgate.net/profile/Example_Profile"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Fetching Publications..." : "Fetch Publications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Crawler;

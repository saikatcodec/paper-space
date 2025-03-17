import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminLayout from "./components/AdminLayout";
import { usePageTitle } from "../hooks/usePageTitle";

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publish_date: new Date().toISOString().split("T")[0],
    image_url: "",
    news_type: "announcement",
    is_featured: false,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  usePageTitle("Add News Item | Admin");
  useEffect(() => {
    // If editing, fetch existing news data
    if (isEditMode) {
      const fetchNewsData = async () => {
        try {
          const response = await api.get(`/admin/news/${id}`);

          // Format date for form input
          const data = response.data;
          if (data.publish_date_str) {
            data.publish_date = data.publish_date_str;
          }

          setFormData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching news data:", err);
          setError("Error loading news data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchNewsData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await api.patch(`/admin/news/${id}`, formData);
      } else {
        await api.post("/admin/news", formData);
      }

      setSuccess(true);

      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate("/admin/news");
      }, 1500);
    } catch (err) {
      console.error("Error saving news:", err);
      setError("Failed to save news. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const newsTypes = [
    { value: "announcement", label: "Announcement" },
    { value: "upcoming_paper", label: "Upcoming Paper" },
    { value: "project", label: "Project" },
    { value: "event", label: "Event" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit News" : "Add News"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update the details of this news item"
              : "Create a new news item to display on the website"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            {isEditMode
              ? "News updated successfully! Redirecting..."
              : "News created successfully! Redirecting..."}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              name="title"
              placeholder="News Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content *
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="content"
              name="content"
              placeholder="News Content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="publish_date"
            >
              Publication Date *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="publish_date"
              type="date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image_url"
            >
              Image URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image_url"
              type="url"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="news_type"
            >
              News Type *
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="news_type"
              name="news_type"
              value={formData.news_type}
              onChange={handleInputChange}
              required
            >
              {newsTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
              />
              <span className="text-sm">
                Feature this news item (displayed prominently)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update News"
              ) : (
                "Create News"
              )}
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate("/admin/news")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewsEditor;

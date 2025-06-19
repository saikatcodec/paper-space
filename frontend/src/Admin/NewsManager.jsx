import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import AdminLayout from "./components/AdminLayout";
import { usePageTitle } from "../hooks/usePageTitle";

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteMessage, setDeleteMessage] = useState({ type: "", message: "" });

  usePageTitle("Manage News | Admin");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/news");
      setNews(response.data);
    } catch (err) {
      setError("Failed to load news items.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;

    try {
      await api.delete(`/admin/news/${id}`);
      setDeleteMessage({
        type: "success",
        message: "News item deleted successfully!",
      });
      fetchNews(); // Refresh the list

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteMessage({ type: "", message: "" });
      }, 3000);
    } catch (err) {
      setDeleteMessage({
        type: "error",
        message: "Error deleting news item.",
      });
      console.error("Error deleting news:", err);
    }
  };

  const getNewsTypeLabel = (type) => {
    switch (type) {
      case "upcoming_paper":
        return "Upcoming Paper";
      case "project":
        return "Project";
      case "event":
        return "Event";
      case "announcement":
        return "Announcement";
      default:
        return type;
    }
  };

  // Filter news items by search term and type
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "" || item.news_type === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const getUniqueTypes = () => {
    const types = new Set();
    news.forEach((item) => types.add(item.news_type));
    return Array.from(types);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading news items...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage News</h1>
          <Link
            to="/admin/news/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add News
          </Link>
        </div>

        {/* Status messages */}
        {deleteMessage.message && (
          <div
            className={`mb-4 p-4 rounded ${
              deleteMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {deleteMessage.message}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Types</option>
              {getUniqueTypes().map((type) => (
                <option key={type} value={type}>
                  {getNewsTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News items table */}
        {filteredNews.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No news items found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Featured</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getNewsTypeLabel(item.news_type)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.publish_date_str}</td>
                    <td className="py-3 px-4">
                      {item.is_featured ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/admin/news/edit/${item.id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white"
                }`}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white"
                }`}
              >
                Prev
              </button>
              <span className="px-3 py-1">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white"
                }`}
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white"
                }`}
              >
                Last
              </button>
            </nav>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsManager;

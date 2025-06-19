import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { API_URL } from "../utils/api";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/news`);
        setNewsData(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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

  const getUniqueTypes = () => {
    const types = new Set();
    newsData.forEach((item) => {
      types.add(item.news_type);
    });
    return Array.from(types);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredNews = filter
    ? newsData.filter((item) => item.news_type === filter)
    : newsData;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Research News & Updates</h1>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filter by news type */}
        <div className="mb-6">
          <label htmlFor="filter-type" className="sr-only">
            Filter by Type
          </label>
          <div className="w-full sm:w-64">
            <select
              id="filter-type"
              name="filter-type"
              value={filter}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

        {/* Featured news */}
        {filteredNews.filter((item) => item.is_featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Featured News</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredNews
                .filter((item) => item.is_featured)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow overflow-hidden rounded-lg"
                  >
                    {item.image_url && (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link
                            to={`/news/${item.id}`}
                            className="hover:underline"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getNewsTypeLabel(item.news_type)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.publish_date_str}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {item.content}
                      </p>
                      <div className="mt-4">
                        <Link
                          to={`/news/${item.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Read more <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All news */}
        <div>
          <h2 className="text-xl font-bold mb-4">All News</h2>
          {filteredNews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No news items available.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredNews.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/news/${item.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {item.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getNewsTypeLabel(item.news_type)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {item.content.substring(0, 100)}
                              {item.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>{item.publish_date_str}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;

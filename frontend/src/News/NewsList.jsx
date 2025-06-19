import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  usePageTitle("Research News & Updates");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/user/news");
        setNews(response.data);
      } catch (err) {
        console.error("Error fetching news:", err);
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

  // Filter news items based on search and type filter
  const filteredNews = news.filter((item) => {
    const matchesSearch = searchTerm
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType = filterType ? item.news_type === filterType : true;

    return matchesSearch && matchesType;
  });

  // Get unique news types for filter dropdown
  const newsTypes = [...new Set(news.map((item) => item.news_type))];

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-16 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">News & Updates</h1>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-full md:w-1/3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All News Types</option>
              {newsTypes.map((type) => (
                <option key={type} value={type}>
                  {getNewsTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No news items found matching your criteria.
            </p>
          </div>
        )}

        {/* Featured news at the top if any */}
        {!loading &&
          !error &&
          filteredNews.some((item) => item.is_featured) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews
                  .filter((item) => item.is_featured)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/800x400?text=No+Image";
                          }}
                        />
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold">
                            <Link
                              to={`/news/${item.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {item.title}
                            </Link>
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getNewsTypeLabel(item.news_type)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                          {item.publish_date_str}
                        </p>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {item.content}
                        </p>
                        <Link
                          to={`/news/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* All other news */}
        {!loading && !error && filteredNews.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {filteredNews.some((item) => item.is_featured)
                ? "Latest News"
                : "All News"}
            </h2>
            <div className="space-y-6">
              {filteredNews
                .filter((item) => !item.is_featured)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">
                        <Link
                          to={`/news/${item.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getNewsTypeLabel(item.news_type)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      {item.publish_date_str}
                    </p>
                    <p className="text-gray-600 line-clamp-3">{item.content}</p>
                    <div className="mt-4">
                      <Link
                        to={`/news/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsList;

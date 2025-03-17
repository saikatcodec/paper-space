import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import api from "../utils/api";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/user/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(
          error.response?.status === 404
            ? "The requested news item could not be found."
            : "Failed to load news item. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // Dynamic title that updates once data is loaded
  usePageTitle(news ? news.title : "News Article");

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

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-16 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
            <button
              onClick={goBack}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
          </div>
        ) : news ? (
          <div>
            <div className="mb-6">
              <button
                onClick={goBack}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>
            </div>

            <article>
              {news.image_url && (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-64 md:h-96 object-cover mb-6"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                    {news.title}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getNewsTypeLabel(news.news_type)}
                  </span>
                </div>

                <p className="text-gray-500 mb-6">{news.publish_date_str}</p>
              </div>

              <div className="prose max-w-none">
                {/* Split by new lines and render as paragraphs */}
                {news.content.split("\n").map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p
                      key={index}
                      className="mb-4 text-gray-800 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ) : null
                )}
              </div>
            </article>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No news item found.</p>
            <button
              onClick={goBack}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back to previous page
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsDetail;

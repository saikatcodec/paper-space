import React from "react";
import { Link } from "react-router-dom";

function NewsScrollable({ title, content, viewAllLink }) {
  // Function to display appropriate label for news type
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

  return (
    <div className="h-full mt-5 bg-white shadow-md rounded-md p-4 sm:px-40 overflow-hidden">
      <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
        {title}
      </h2>

      <div className="overflow-y-auto">
        {content.length > 0 ? (
          content.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3 border-y hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 hover:text-blue-800 text-sm">
                  <Link to={`/news/${item.id}`}>{item.title}</Link>
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getNewsTypeLabel(item.news_type)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {item.publish_date_str}
              </p>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                {item.content}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No news available</div>
        )}
      </div>

      <div className="text-right">
        <Link
          to={viewAllLink}
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>
    </div>
  );
}

export default NewsScrollable;

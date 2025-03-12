import React from "react";
import { Link } from "react-router-dom";

function Scrollable({ title, content, viewAllLink }) {
  return (
    <div className="h-full mt-5 bg-white shadow-md rounded-md p-4 sm:px-40 overflow-hidden">
      <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
        {title}
      </h2>

      <div className="overflow-y-auto">
        {content.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="p-3 border-y hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-slate-700 hover:text-blue-800 text-sm">
              <Link to={`/publication/${item.id}`}>{item.title}</Link>
            </h3>
            <p className="text-gray-500 text-xs">{item.pub_date_str}</p>
          </div>
        ))}
      </div>

      <div className="text-right">
        <Link
          to={viewAllLink}
          className="bg-transparent inline-block mt-4 text-blue-700 font-semibold transition text-center py-2 px-4 hover:border-b border-blue-700"
        >
          See More
        </Link>
      </div>
    </div>
  );
}

export default Scrollable;

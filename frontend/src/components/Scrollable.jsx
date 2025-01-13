import React from "react";
import { Link } from "react-router-dom";

function Scrollable({ title, content, viewAllLink }) {
  return (
    <div className="flex flex-col justify-between bg-white shadow-lg rounded-lg p-6 overflow-hidden w-full md:w-1/3 lg:w-1/4">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
        <div className="overflow-y-auto h-[300px]">
          {content.map((item, index) => (
            <div
              key={index}
              className="mb-4 p-3 bg-gray-50 border rounded-md hover:bg-gray-100 transition"
            >
              <p className="font-semibold text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <Link
        to={viewAllLink}
        className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        View All
      </Link>
    </div>
  );
}

export default Scrollable;

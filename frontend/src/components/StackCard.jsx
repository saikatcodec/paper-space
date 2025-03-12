import React from "react";
import { Link } from "react-router-dom";

function StackCard({ researchData }) {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="flex flex-col gap-6">
      {researchData.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md mx-auto md:w-3/4 rounded-md p-4 border border-gray-200 hover:shadow-lg transition"
        >
          <h2 className="text-base md:text-lg font-bold text-black">
            {item.title}
          </h2>
          <p className="text-sm text-gray-600">{`Published: ${item.pub_date_str}`}</p>
          <p className="text-sm text-gray-500">{item.types.join(", ")}</p>
          <Link
            to={`/publication/${item.id}`}
            className="mt-4 inline-block p-10  text-center bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
          >
            View
          </Link>
        </div>
      ))}
    </div>
  );
}

export default StackCard;

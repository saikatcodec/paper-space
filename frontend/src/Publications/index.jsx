import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Publication = () => {
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/user/get_all_research"
        );
        setResearchData(response.data);
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Research Publications</h1>
      </header>
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchData.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-md p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold text-blue-600">{item.title}</h2>
              <p className="text-sm text-gray-600">{`Published: ${item.pub_date_str}`}</p>
              <p className="text-sm text-gray-500">{item.types.join(", ")}</p>
              <Link
                to={`/publication/${item.id}`}
                className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Publication;

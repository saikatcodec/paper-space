import React, { useEffect, useState } from "react";
import axios from "axios";

import StackCard from "../components/StackCard";

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
      <main className="m-4 md:mx-28 lg:mx-48">
        <StackCard researchData={researchData} />
      </main>
    </div>
  );
};

export default Publication;

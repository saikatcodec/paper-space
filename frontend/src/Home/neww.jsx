import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
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

  const comingSoonContent = Array(10).fill("Coming Soon");

  const ScrollableSection = ({ title, content, viewAllLink }) => (
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
        className="mt-4 block text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition"
      >
        View All
      </Link>
    </div>
  );

  return (
    <div className="min-h-[90vh] bg-gray-100 flex flex-wrap gap-6 p-6 justify-center">
      {/* Main Content Section */}
      <div
        className="flex-grow flex flex-col p-6 justify-center items-center h-[70vh] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Welcome to PaperSpace</h1>
          <p className="text-gray-200">
            Explore our platform for the latest publications and research
            insights.
          </p>
        </div>
      </div>

      {/* Latest Publications Section */}
      <ScrollableSection
        title="Latest Publications"
        content={
          loading
            ? ["Loading..."]
            : researchData.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="mb-4 p-3 bg-gray-50 border rounded-md hover:bg-gray-100 transition"
                >
                  <h3 className="font-semibold text-blue-600 text-sm">
                    <Link to={`/publication/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="text-gray-500 text-xs">{item.pub_date_str}</p>
                </div>
              ))
        }
        viewAllLink="/publications"
      />

      {/* Scrollable Projects Section */}
      <ScrollableSection
        title="Projects"
        content={comingSoonContent}
        viewAllLink="/projects"
      />

      {/* Scrollable Upcoming Projects Section */}
      <ScrollableSection
        title="Upcoming Projects"
        content={comingSoonContent}
        viewAllLink="/upcoming-projects"
      />

      {/* Scrollable Upcoming Publications Section */}
      <ScrollableSection
        title="Upcoming Publications"
        content={comingSoonContent}
        viewAllLink="/upcoming-publications"
      />
    </div>
  );
};

export default HomePage;

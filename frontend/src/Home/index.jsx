import { useEffect, useState } from "react";
import axios from "axios";
import { usePageTitle } from "../hooks/usePageTitle";

import ScrollableSection from "../components/Scrollable";
import homeCover from "../assets/home_cover.png";
import NewsScrollable from "../components/NewsScrollable";
import { API_URL } from "../utils/api";

const HomePage = () => {
  usePageTitle("Research Home");

  const [researchData, setResearchData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const [researchResponse, newsResponse] = await Promise.all([
          axios.get(`${API_URL}/user/get_all_research`),
          axios.get(`${API_URL}/user/news`),
        ]);

        setResearchData(researchResponse.data);
        setNewsData(newsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 justify-center bg-gray-100">
      <div>
        {/* Main Content Section */}
        <div
          className="flex-grow flex flex-col p-6 justify-center items-center h-[70vh] bg-contain bg-no-repeat bg-center relative"
          style={{
            backgroundImage: `url(${homeCover})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative text-center text-white bg-slate-500 p-6 rounded-md">
            <h1 className="text-3xl font-bold mb-4">Welcome to PaperSpace</h1>
            <p className="text-gray-200">
              Explore our platform for the latest publications and research
              insights.
            </p>
          </div>
        </div>

        {/* News Section */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <NewsScrollable
            title="Latest News & Updates"
            content={newsData}
            viewAllLink="/news"
          />
        )}

        {/* Scrollable Publications Section */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ScrollableSection
            title="Latest Publications"
            content={researchData}
            viewAllLink="/publications"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

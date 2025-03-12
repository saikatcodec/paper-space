import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import ScrollableSection from "../components/Scrollable";
import homeCover from "../assets/home_cover.png";

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

      <div className="flex justify-around pt-2">
        {/* Scrollable Projects Section */}
        {/* <ScrollableSection
          title="Projects"
          content={comingSoonContent}
          viewAllLink="/projects"
        /> */}

        {/* Scrollable Upcoming Projects Section */}
        {/* <ScrollableSection
          title="Upcoming Projects"
          content={comingSoonContent}
          viewAllLink="/upcoming-projects"
        /> */}

        {/* Scrollable Upcoming Publications Section */}
        {/* <ScrollableSection
          title="Upcoming Publications"
          content={comingSoonContent}
          viewAllLink="/upcoming-publications"
        /> */}
      </div>
    </div>
  );
};

export default HomePage;

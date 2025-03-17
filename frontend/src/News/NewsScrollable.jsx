import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewsScrollable from "../News/NewsScrollable";
import api from "../api"; // Assuming you have an api module for making HTTP requests

const Home = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await api.get("/user/news");
        setNewsData(newsResponse.data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {newsData.length > 0 && (
        <NewsScrollable
          title="Latest News"
          content={newsData}
          viewAllLink="/news"
        />
      )}
    </div>
  );
};

export default Home;

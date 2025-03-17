import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePageTitle } from "../hooks/usePageTitle";

import StackCard from "../components/StackCard";

const Publication = () => {
  usePageTitle("Research Publications");

  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Get unique publication types from all research data
  const getUniqueTypes = () => {
    const types = new Set();
    researchData.forEach((paper) => {
      if (paper.types && Array.isArray(paper.types)) {
        paper.types.forEach((type) => types.add(type));
      }
    });
    return Array.from(types).sort();
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/user/get_all_research"
        );
        setResearchData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data when search term or filter type changes
  useEffect(() => {
    const filterResults = () => {
      let results = [...researchData];

      // Filter by search term
      if (searchTerm.trim() !== "") {
        const lowercasedSearch = searchTerm.toLowerCase();
        results = results.filter(
          (paper) =>
            (paper.title &&
              paper.title.toLowerCase().includes(lowercasedSearch)) ||
            (paper.abstract &&
              paper.abstract.toLowerCase().includes(lowercasedSearch)) ||
            (paper.authors &&
              paper.authors.some((author) =>
                author.toLowerCase().includes(lowercasedSearch)
              ))
        );
      }

      // Filter by publication type
      if (filterType) {
        results = results.filter(
          (paper) => paper.types && paper.types.includes(filterType)
        );
      }

      setFilteredData(results);
    };

    filterResults();
  }, [searchTerm, filterType, researchData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Research Publications</h1>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="w-full md:w-1/2">
              <label htmlFor="search" className="sr-only">
                Search publications
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search by title, authors, or keywords..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <div className="w-full sm:w-auto">
                <select
                  id="filter-type"
                  name="filter-type"
                  value={filterType}
                  onChange={handleFilterChange}
                  className="block w-full py-3 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                >
                  <option value="">All Types</option>
                  {getUniqueTypes().map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm || filterType) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                No publications match your search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters and try again
              </button>
            </div>
          )}

          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredData.length}{" "}
              {filteredData.length === 1 ? "publication" : "publications"}
              {searchTerm || filterType ? " matching your filters" : ""}
            </div>
          )}
        </div>

        <main className="md:mx-4">
          <StackCard researchData={filteredData} />
        </main>
      </div>
    </div>
  );
};

export default Publication;

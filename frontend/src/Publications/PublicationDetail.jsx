import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import api from "../utils/api";

const PublicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await api.get(`/user/paper/${id}`);
        setPublication(response.data);
      } catch (error) {
        console.error("Error fetching publication:", error);
        setError("Failed to load publication details");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  // Dynamic title that updates once data is loaded
  usePageTitle(publication ? publication.title : "Publication Details");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="ml-3">Loading publication details...</p>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error || "Publication not found"}</p>
        </div>
        <button
          onClick={handleGoBack}
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Format the publication date if available
  const formattedDate = publication.pub_date
    ? new Date(publication.pub_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Publication Details Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{publication.title}</h1>
        </div>

        <div className="p-6">
          {/* Publication Info */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
              <span className="mr-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Published: {formattedDate}
              </span>
              <span className="mr-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Citations: {publication.citation_count || "0"}
              </span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Reads: {publication.read_count || "0"}
              </span>
            </div>
          </div>

          {/* Authors */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Authors
            </h2>
            <div className="flex flex-wrap gap-2">
              {publication.authors &&
                publication.authors.map((author, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                  >
                    {author}
                  </span>
                ))}
            </div>
          </div>

          {/* Abstract */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Abstract
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">
                {publication.abstract || "No abstract available"}
              </p>
            </div>
          </div>

          {/* References */}
          {publication.references && publication.references.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                References ({publication.references.length})
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <ol className="list-decimal pl-5">
                  {publication.references.map((reference, index) => (
                    <li key={index} className="mb-2 text-sm text-gray-700">
                      {reference.title ||
                        reference.text ||
                        "Untitled reference"}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            {publication.link && (
              <a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                View Original Paper
              </a>
            )}

            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center transition-colors"
              onClick={() => window.print()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;

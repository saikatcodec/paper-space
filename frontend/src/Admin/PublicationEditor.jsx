import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminLayout from "./components/AdminLayout";

const PublicationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    abstract: "",
    pub_date_str: "",
    link: "",
    types: [],
    // Removed publication, doi, and keywords fields
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Publication types available for selection
  const availableTypes = [
    "Article",
    "Conference Paper",
    "Book Chapter",
    "Review",
    "Technical Report",
    "Thesis",
    "Preprint",
    "Other",
  ];

  useEffect(() => {
    // If we're in edit mode, fetch the publication data
    if (isEditMode) {
      const fetchPublication = async () => {
        try {
          const response = await api.get(`/user/paper/${id}`);
          const publication = response.data;

          setFormData({
            title: publication.title || "",
            authors: publication.authors?.join(", ") || "",
            abstract: publication.abstract || "",
            pub_date_str: publication.pub_date_str || "",
            link: publication.link || "",
            types: publication.types || [],
            // Removed publication, doi, and keywords fields
          });

          setLoading(false);
        } catch (err) {
          console.error("Error fetching publication:", err);
          setError("Failed to load publication data. Please try again.");
          setLoading(false);
        }
      };

      fetchPublication();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter((t) => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Format the data for the API
      const publicationData = {
        ...formData,
        authors: formData.authors
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        // Removed keywords processing
      };

      if (isEditMode) {
        await api.put(`/admin/publications/${id}`, publicationData);
      } else {
        await api.post("/admin/publications", publicationData);
      }

      navigate("/admin/publications");
    } catch (err) {
      console.error("Error saving publication:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to save publication. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? "Edit Publication" : "Add New Publication"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isEditMode
              ? "Update the details of your research publication"
              : "Enter the details of your new research publication"}
          </p>
        </div>

        {error && (
          <div className="mx-4 my-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="authors"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Authors * (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="authors"
                    id="authors"
                    value={formData.authors}
                    onChange={handleChange}
                    required
                    placeholder="John Doe, Jane Smith, etc."
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="abstract"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Abstract
                  </label>
                  <textarea
                    id="abstract"
                    name="abstract"
                    rows={4}
                    value={formData.abstract}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter the abstract of your publication"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="pub_date_str"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Publication Date
                  </label>
                  <input
                    type="text"
                    name="pub_date_str"
                    id="pub_date_str"
                    value={formData.pub_date_str}
                    onChange={handleChange}
                    placeholder="e.g., January 2023"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Publication URL
                  </label>
                  <input
                    type="url"
                    name="link"
                    id="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Publication Types
                  </label>
                  <div className="mt-2 space-x-2 space-y-2 flex flex-wrap">
                    {availableTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`type-${type}`}
                          name="types"
                          type="checkbox"
                          checked={formData.types.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Removed Publication Venue, DOI, and Keywords sections */}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/publications")}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Publication"
                  : "Save Publication"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PublicationEditor;

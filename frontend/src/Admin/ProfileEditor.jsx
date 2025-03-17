import React, { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import api from "../utils/api";

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    name: "",
    position: "",
    bio: "",
    total_pub: "",
    reads: "",
    total_citations: "",
    email: "",
    institution: "",
    department: "",
    address: "",
    phone: "",
    website: "",
    social_links: {
      github: "",
      twitter: "",
      linkedin: "",
      researchgate: "",
      googlescholar: "",
    },
    skills: [],
    profile_pic: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/user/get_profile");

        // Ensure research_interests is always an array
        const profileData = {
          ...response.data,
          research_interests: response.data.research_interests || [],
        };

        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profile_pic: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addResearchInterest = () => {
    if (
      newInterest.trim() !== "" &&
      !profile.research_interests.includes(newInterest.trim())
    ) {
      setProfile((prev) => ({
        ...prev,
        research_interests: [...prev.research_interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const removeResearchInterest = (interest) => {
    setProfile((prev) => ({
      ...prev,
      research_interests: prev.research_interests.filter(
        (item) => item !== interest
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();

      // Add all profile fields to formData
      Object.keys(profile).forEach((key) => {
        if (key === "social_links") {
          Object.keys(profile.social_links).forEach((socialKey) => {
            formData.append(
              `social_links.${socialKey}`,
              profile.social_links[socialKey]
            );
          });
        } else if (key === "research_interests") {
          profile.research_interests.forEach((interest) => {
            formData.append("research_interests", interest);
          });
        } else if (
          key === "profile_pic" &&
          profile.profile_pic instanceof File
        ) {
          formData.append("profile_pic", profile.profile_pic);
        } else if (key !== "profile_pic") {
          formData.append(key, profile[key]);
        }
      });

      await api.put("/admin/update_profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
            Profile Editor
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your research profile information
          </p>
        </div>

        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-4 mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              {/* Profile Image */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="profile_pic"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Image
                </label>
                <div className="mt-1 flex items-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : profile.profile_pic_url ? (
                        <img
                          src={profile.profile_pic_url}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="file"
                      id="profile_pic"
                      name="profile_pic"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center hover:bg-black hover:bg-opacity-30 rounded-full">
                      <span className="text-xs text-white opacity-0 hover:opacity-100">
                        Change
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() =>
                      document.getElementById("profile_pic").click()
                    }
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profile.name || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title / Position
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={profile.position || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profile.bio || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-gray-700"
                >
                  Institution
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    value={profile.institution || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={profile.department || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={profile.address || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={profile.phone || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={profile.website || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Academic Metrics */}
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Academic Metrics
                </h3>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="total_pub"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Publications
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="total_pub"
                    id="total_pub"
                    value={profile.total_pub || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="reads"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Reads
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="reads"
                    id="reads"
                    value={profile.reads || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="total_citations"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Citations
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="total_citations"
                    id="total_citations"
                    value={profile.total_citations || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Social Media Links
                </h3>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="social_links.github"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social_links.github"
                    id="social_links.github"
                    value={profile.social_links?.github || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="social_links.twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social_links.twitter"
                    id="social_links.twitter"
                    value={profile.social_links?.twitter || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="social_links.linkedin"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social_links.linkedin"
                    id="social_links.linkedin"
                    value={profile.social_links?.linkedin || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="social_links.researchgate"
                  className="block text-sm font-medium text-gray-700"
                >
                  ResearchGate
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social_links.researchgate"
                    id="social_links.researchgate"
                    value={profile.social_links?.researchgate || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="social_links.googlescholar"
                  className="block text-sm font-medium text-gray-700"
                >
                  Google Scholar
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social_links.googlescholar"
                    id="social_links.googlescholar"
                    value={profile.social_links?.googlescholar || ""}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Research Interests */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="research_interests"
                  className="block text-sm font-medium text-gray-700"
                >
                  Research Interests
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.research_interests?.map((interest, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeResearchInterest(interest)}
                        className="ml-1 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="newInterest"
                    id="newInterest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add a research interest"
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={addResearchInterest}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    value={profile.skills?.join(", ") || ""}
                    onChange={(e) => {
                      const skillsArray = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setProfile((prev) => ({
                        ...prev,
                        skills: skillsArray,
                      }));
                    }}
                    placeholder="Enter skills separated by commas"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Separate skills with commas (e.g., Machine Learning, Data
                  Analysis)
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfileEditor;

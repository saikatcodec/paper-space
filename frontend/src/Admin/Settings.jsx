import React, { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import api from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";

const Settings = () => {
  const [formData, setFormData] = useState({
    username: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [siteSettings, setSiteSettings] = useState({
    site_title: "",
    meta_description: "",
    enable_publications: true,
    enable_projects: true,
    google_analytics_id: "",
    show_citation_counts: true,
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  usePageTitle("Site Settings | Admin");
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await api.get("/admin/site_settings");
        setSiteSettings(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching site settings:", err);
        setSettingsError("Failed to load site settings.");
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSiteSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (formData.new_password !== formData.confirm_password) {
      setPasswordError("New passwords don't match");
      return;
    }

    setIsSavingPass(true);
    try {
      await api.post("/admin/change_password", {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });

      setPasswordSuccess("Password changed successfully");
      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsSavingPass(false);
    }
  };

  const saveSiteSettings = async (e) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");
    setIsSavingSettings(true);

    try {
      await api.post("/admin/site_settings", siteSettings);
      setSettingsSuccess("Site settings updated successfully");
    } catch (err) {
      setSettingsError(
        err.response?.data?.detail ||
          "Failed to update site settings. Please try again."
      );
    } finally {
      setIsSavingSettings(false);
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
      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your admin account details
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {passwordError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                </div>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{passwordSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={changePassword} className="space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handlePasswordChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="current_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    id="current_password"
                    value={formData.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={formData.new_password}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    value={formData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPass}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSavingPass ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSavingPass ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Site Settings Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Site Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your website configuration
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {settingsError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{settingsError}</p>
                  </div>
                </div>
              </div>
            )}

            {settingsSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{settingsSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={saveSiteSettings} className="space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="site_title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Site Title
                  </label>
                  <input
                    type="text"
                    name="site_title"
                    id="site_title"
                    value={siteSettings.site_title}
                    onChange={handleSettingsChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="meta_description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Meta Description
                  </label>
                  <textarea
                    name="meta_description"
                    id="meta_description"
                    rows={3}
                    value={siteSettings.meta_description}
                    onChange={handleSettingsChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description for search engines.
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="google_analytics_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics_id"
                    id="google_analytics_id"
                    placeholder="UA-XXXXXXXXX-X"
                    value={siteSettings.google_analytics_id}
                    onChange={handleSettingsChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enable_publications"
                        name="enable_publications"
                        type="checkbox"
                        checked={siteSettings.enable_publications}
                        onChange={handleSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="enable_publications"
                        className="font-medium text-gray-700"
                      >
                        Enable Publications Page
                      </label>
                      <p className="text-gray-500">
                        Show or hide the publications section on the website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enable_projects"
                        name="enable_projects"
                        type="checkbox"
                        checked={siteSettings.enable_projects}
                        onChange={handleSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="enable_projects"
                        className="font-medium text-gray-700"
                      >
                        Enable Projects Page
                      </label>
                      <p className="text-gray-500">
                        Show or hide the projects section on the website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="show_citation_counts"
                        name="show_citation_counts"
                        type="checkbox"
                        checked={siteSettings.show_citation_counts}
                        onChange={handleSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="show_citation_counts"
                        className="font-medium text-gray-700"
                      >
                        Show Citation Counts
                      </label>
                      <p className="text-gray-500">
                        Display the number of citations for each publication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSavingSettings ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;

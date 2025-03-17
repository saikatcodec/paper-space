// Import necessary modules
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePageTitle } from "../hooks/usePageTitle";

const ProfilePage = () => {
  usePageTitle("Researcher Profile");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/user/get_profile"
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center p-6 bg-gray-100">
          <img
            src={profile.profile_pic}
            alt={profile.name}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600">
              {profile.position}, {profile.department}
            </p>
            <p className="text-gray-600">{profile.institution}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Contact Information
            </h2>
            <div className="flex justify-center items-center">
              <div className="flex justify-between w-5/6">
                <p className="text-gray-600">Address: {profile.address}</p>
                <p className="text-gray-600">Phone: {profile.phone || "N/A"}</p>
                <p className="text-gray-600">Email: {profile.email || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Publications and Citations
            </h2>
            <div className="flex justify-center items-center">
              <div className="flex justify-between w-5/6">
                <p className="text-gray-600">
                  Total Publications: {profile.total_pub}
                </p>
                <p className="text-gray-600">
                  Total Citations: {profile.total_citations}
                </p>
                <p className="text-gray-600">Reads: {profile.reads}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            <ul className="list-disc list-inside text-gray-600">
              {profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

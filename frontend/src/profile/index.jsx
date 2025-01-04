import React from "react";

function ProfessionalProfileCard() {
  let user = {
    id: "alam123",
    name: "Dr. Md. Alam Hossain",
    email: "alam@just.edu.bd",
    phone: "+88017XXXXXXXX",
    Profession: "Professor of CSE department at JUST",
  };

  let externalLinks = {
    researchGate: "https://www.researchgate.net/profile/Md-Alam-Hossain",
  };

  const topics = [
    "Cloud Computing",
    "Security",
    "Virtualization",
    "Network Security",
    "Mobile Cloud Computing",
    "IT Security",
    "Computer Networks Security",
    "Information Security",
    "Computer Security",
    "Wireless Computing",
    "Wireless Security",
    "Cyber Security",
    "IoT and IoT Security",
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
      {/* Header Section */}
      <div className="relative bg-blue-600 h-40">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white object-cover"
        />
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.Profession}</p>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-800">About</h3>
            <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Edit Profile
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {user.phone}
            </div>
            <div>
              <span className="font-semibold">Profession:</span>{" "}
              {user.Profession}
            </div>
          </div>
        </div>

        {/* Work Links Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Work Links
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                Website Link
              </a>
            </li>
            <li>
              <a
                href={externalLinks.researchGate}
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                ResearchGate Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {topics.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalProfileCard;

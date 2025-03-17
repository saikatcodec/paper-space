import React from "react";
import { usePageTitle } from "../hooks/usePageTitle";

const Projects = () => {
  usePageTitle("Research Projects");

  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <h1 className="text-5xl font-bold">Coming Soon</h1>
    </div>
  );
};

export default Projects;

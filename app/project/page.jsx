import React from "react";

import ProjectCard from "@/components/project/projectCard";

const title = "projects";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

function Project() {
  return <ProjectCard />;
}

export default Project;

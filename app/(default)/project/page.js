import React from "react";
import projectItems from "./projectItems";
import Link from "next/link";
import Image from "next/image";

const title = "project";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

function Project() {
  return (
    <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
      {projectItems.map((projectItem) => (
        <div className="bg-white text-black shadow-xl rounded-md mt-5">
          <div className="flex justify-center">
            <Link href={"project/" + projectItem.id}>
              <Image
                width={20}
                height={20}
                src={projectItem.image}
                className="w-full h-full hover:opacity-70 object-fill rounded-t-md hover:shadow-xl hover:scale-105 hover:rounded-md"
              />
            </Link>
          </div>
          <div className="p-6">
            <div className="flex justify-start capitalize">
              <Link href={"project/" + projectItem.id}>
                {projectItem.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Project;

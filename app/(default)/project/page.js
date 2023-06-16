import React from 'react';
import projectItems from './projectItems';

const title = 'project';
export const metadata = {
  title: 'fiqriachmada | ' + title,
  description: 'pernosal site',
};

function Project() {
  return (
    <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
      {projectItems.map((projectItem) => (
        <div className="bg-white text-black shadow-xl rounded-md mt-5">
          <div className="flex justify-center">
            <a href={projectItem.link} target="_blank">
              <img
                src={projectItem.image}
                className="hover:opacity-70 object-fill rounded-t-md hover:shadow-xl"
              />
            </a>
          </div>
          <div className="p-6">
            <div className="flex justify-start capitalize">
              <a href={projectItem.link} target="_blank">
                {projectItem.title}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Project;

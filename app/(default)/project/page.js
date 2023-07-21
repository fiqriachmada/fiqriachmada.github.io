import React from 'react';
import projectItems from './projectItems';
import Link from 'next/link';

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
            <Link href={'project/' + projectItem.id} target="_blank">
              <img
                src={projectItem.image}
                className="hover:opacity-70 object-fill rounded-t-md hover:shadow-xl hover:scale-105 hover:rounded-md"
              />
            </Link>
          </div>
          <div className="p-6">
            <div className="flex justify-start capitalize">
              <Link href={'project/' + projectItem.id} target="_blank">
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

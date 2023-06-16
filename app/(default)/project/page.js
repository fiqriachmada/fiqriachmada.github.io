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
                className="hover:opacity-70 object-fill rounded-t-md"
              />
            </a>
          </div>
          <div className="p-6 md::px-10">
            <>
              <div className="flex justify-start pt-5 capitalize">
                <a href={projectItem.link} target="_blank">
                  {projectItem.title}
                </a>
              </div>
              {/* <div className='text-center pt-5 '>{projectItem.content[1]}</div>
              <div className='text-center pt-5 '>{projectItem.content[2]}</div> */}
            </>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Project;

import React from 'react';
import aboutItem from './aboutItems';
import aboutItems from './aboutItems';

function About() {
  return (
    <div>
      {aboutItems.map((aboutItem) => (
        <div className="bg-white text-black shadow-xl rounded-md mt-5 mb-5">
          {/* <div className="bg-white text-black shadow-2xl"> */}
          <div className="p-6">
            <div className="flex justify-center pt-5 capitalize">
              {aboutItem.welcome}
            </div>
            <div className="flex justify-center pt-5">
              <img
                src="https://svgshare.com/i/tmn.svg"
                className="hover:bg-slate-300 hover:rounded-2xl"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default About;

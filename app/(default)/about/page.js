import React from 'react';
import aboutItems from './aboutItems';
import Link from 'next/link';

const title = 'about';
export const metadata = {
  title: 'fiqriachmada | ' + title,
  description: 'pernosal site',
};

function About() {
  return (
    <div>
      {aboutItems.map((aboutItem) => (
        <div className="bg-white text-black shadow-xl rounded-md">
          <div className="p-6 lg:px-32">
            <div className="flex justify-center pt-5 capitalize">
              {aboutItem.welcome}
            </div>
            <div className="flex justify-center pt-5">
              <Link href={aboutItem.link}>
                <img
                  src="https://svgshare.com/i/tmn.svg"
                  className="hover:opacity-70"
                />
              </Link>
            </div>
            <div className="text-center pt-5 ">{aboutItem.content[1]}</div>
            <div className="text-center pt-5 ">{aboutItem.content[2]}</div>
            <div className="text-center pt-5 ">{aboutItem.content[3]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default About;

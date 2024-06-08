import React from "react";
import aboutItems from "./aboutItems";
import Link from "next/link";

const title = "about";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "pernosal site",
};

function About() {
  return (
    <div>
      {aboutItems.map((aboutItem, index) => (
        <div
          className="bg-gray-200 text-black shadow-xl rounded-md"
          key={index}>
          <div className="p-6 lg:px-20">
            <div className="lg:flex justify-stretch gap-10 items-center pt-5">
              <div className="">
                <Link href={aboutItem.link}>
                  <img
                    src="https://svgshare.com/i/tmn.svg"
                    className="hover:opacity-70 hover:scale-[102%]"
                  />
                </Link>
              </div>
              <div className="pt-5">
                <div className="text-3xl font-bold">{aboutItem.welcome}</div>
                <div className="text-start pt-5 ">{aboutItem.content[1]}</div>
                <div className="text-start pt-5 ">{aboutItem.content[2]}</div>
                <div className="text-start pt-5 ">{aboutItem.content[3]}</div>
                <div className="text-start pt-5 ">{aboutItem.content[4]}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default About;

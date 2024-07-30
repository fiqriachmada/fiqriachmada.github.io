import React from "react";
import aboutItems from "./aboutItems";
import Link from "next/link";
import profile from "@/public/images/profile.jpg";

const title = "about";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "pernosal site",
};

function About() {
  return (
    <div>
      {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}

      {aboutItems.map((aboutItem, index) => (
        <div
          className="bg-gray-200 text-black shadow-xl rounded-md"
          key={index}>
          <div className="p-6 lg:px-20">
            <div className="lg:flex lg:justify-stretch justify-center gap-10 items-center pt-5">
              <div className="flex justify-center">
                <Link href={aboutItem.link}>
                  <img
                    className="hover:opacity-70 hover:scale-[102%] rounded-full"
                    src={profile.src}
                    alt=""
                  />
                </Link>
              </div>
              <div className="pt-5">
                <div className=" text-3xl font-bold">{aboutItem.welcome}</div>
                <div className=" text-start pt-5 ">{aboutItem.content[1]}</div>
                <div className=" text-start pt-5 ">{aboutItem.content[2]}</div>
                <div className=" text-start pt-5 ">{aboutItem.content[3]}</div>
                <div className=" text-start pt-5 ">{aboutItem.content[4]}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default About;

"use client";
import aboutItems from "@/app/about/aboutItems";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import profile from "@/public/images/profile.jpg";
import Loading from "@/app/loading";

function AboutCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <Transition show={mounted} appear={true}>
      <div className="transition duration-500 ease-in data-[closed]:opacity-0">
        {aboutItems.map((aboutItem, index) => (
          <div
            key={index}
            className="bg-gray-200 text-black shadow-xl rounded-md">
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
                  <div className=" text-start pt-5 ">
                    {aboutItem.content[1]}
                  </div>
                  <div className=" text-start pt-5 ">
                    {aboutItem.content[2]}
                  </div>
                  <div className=" text-start pt-5 ">
                    {aboutItem.content[3]}
                  </div>
                  <div className=" text-start pt-5 ">
                    {aboutItem.content[4]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Transition>
  );
}

export default AboutCard;

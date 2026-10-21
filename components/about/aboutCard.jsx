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
            className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm">
            <div className="p-6 lg:px-20">
              <div className="lg:flex lg:justify-stretch justify-center gap-10 items-center pt-5">
                <div className="flex justify-center">
                  <Link href={aboutItem.link}>
                    <img
                      className="hover:opacity-70 hover:scale-[102%] rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                      src={profile.src}
                      alt=""
                    />
                  </Link>
                </div>
                <div className="pt-5">
                  <div className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                    {aboutItem.welcome}
                  </div>
                  <div className="text-start pt-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {aboutItem.content[1]}
                  </div>
                  <div className="text-start pt-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {aboutItem.content[2]}
                  </div>
                  <div className="text-start pt-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {aboutItem.content[3]}
                  </div>
                  <div className="text-start pt-5 text-gray-700 dark:text-gray-300 leading-relaxed">
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

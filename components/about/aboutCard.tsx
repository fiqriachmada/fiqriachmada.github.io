"use client";
import React from "react";
import Link from "next/link";
import profile from "@/public/images/profile.jpg";
import { Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentWork } from "@/lib/workApi";
import { links } from "@/data/homeItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AboutCard() {
  const { data: currentWorkResponse } = useQuery({
    queryKey: ["current-work"],
    queryFn: () => fetchCurrentWork(),
  });

  const currentWork = currentWorkResponse?.data;
  const position = currentWork?.position || "Fullstack Developer";

  return (
    <Transition show={true} appear={true}>
      <div className="size-full rounded-xl shadow-lg transition duration-500 ease-in data-[closed]:opacity-0">
        <div className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm">
          <div className="p-6 lg:px-20">
            {/* Header: Photo + Name + Position */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-5">
              <div className="shrink-0">
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-md hover:scale-105 transition-transform"
                  src={profile.src}
                  alt="Achmada Fiqri"
                />
              </div>

              <div className="text-center sm:text-start flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                  Achmada Fiqri
                </h1>
                <div className="text-xl font-medium text-blue-600 dark:text-blue-400 mt-1">
                  {position}
                </div>

                {/* Dynamic Current Work Badge */}
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xs">
                    {currentWork ? (
                      <>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-gray-800 dark:text-gray-200">
                          {position} di{" "}
                          {currentWork.url ? (
                            <a
                              href={currentWork.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                              {currentWork.name}
                            </a>
                          ) : (
                            <span className="font-bold text-gray-950 dark:text-white">
                              {currentWork.name}
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          ✨ Terbuka untuk bekerja (Open to Work)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Bio */}
            <div className="text-start py-6 leading-7 space-y-4 border-t border-gray-100 dark:border-gray-800 mt-6">
              <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Hi there! I'm <b>Achmada Fiqri</b>, or you can call me <b>Mada</b>.
              </p>
              <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {position}. Sometimes doing code, Mobile Legends, and Basketball with ❤️. Currently based in Jakarta, Indonesia.
              </p>
            </div>

            {/* Contact & Socials */}
            <div className="text-start pt-2 text-gray-700 dark:text-gray-300">
              <p>
                Reach me via email at{" "}
                <a
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  href="mailto:achmadafiqri.work@gmail.com">
                  achmadafiqri.work@gmail.com
                </a>
              </p>
            </div>

            <div className="text-start pt-5">
              <div className="flex gap-8">
                {links.map((link, index) => (
                  <div key={index} className="cursor-pointer">
                    <Link href={link.link} title={link.title} target="_blank">
                      <FontAwesomeIcon
                        className="hover:scale-110 h-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        icon={link.icon}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default AboutCard;


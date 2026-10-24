"use client";

import homeItems from "@/data/homeItems";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentWork } from "@/lib/workApi";
import { Briefcase, Sparkles } from "lucide-react";

const HomeCard = () => {
  const [open] = useState(false);

  // Fetch pekerjaan saat ini secara dinamis dari CMS
  const { data: currentWorkResponse, isLoading } = useQuery({
    queryKey: ["current-work"],
    queryFn: () => fetchCurrentWork(),
  });

  const currentWork = currentWorkResponse?.data;
  const isAvailable = !currentWork && !isLoading;

  return (
    <Transition show={!open} appear={true}>
      <div
        className={clsx(
          "size-full rounded-xl shadow-lg transition duration-400",
          "data-[closed]:translate-y-12 data-[closed]:opacity-0",
          "data-[leave]:duration-500 data-[leave]:ease-in-out",
          "data-[leave]:data-[closed]:scale-95 data-[leave]:data-[closed]:rotate-[0deg]"
        )}>
        <div>
          {homeItems({ currentWork }).map((homeItem, index) => (
            <div
              className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm"
              key={index}>
              <div className="p-6 lg:px-20">
                <div className="text-start text-3xl pt-5 font-extrabold text-gray-950 dark:text-white tracking-tight">
                  {homeItem.content[0]}
                </div>
                <div className="text-start text-xl font-medium text-blue-600 dark:text-blue-400 mt-1">
                  {currentWork?.position || homeItem.content[1]}
                </div>

                {/* Dynamic Current Work Section */}
                <div className="text-start py-6 leading-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xs">
                    {currentWork ? (
                      <>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-gray-800 dark:text-gray-200">
                          {currentWork.position || "Fullstack Developer"} di{" "}
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

                  <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    Fullstack Developer. Sometimes doing code, Mobile Legends and Basketball with ❤️. Currently based on Jakarta, Indonesia.
                  </p>
                </div>

                <div className="text-start pt-2 text-gray-700 dark:text-gray-300">{homeItem.content[3]}</div>
                <div className="text-start pt-5">{homeItem.content[4]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
}

export default HomeCard;

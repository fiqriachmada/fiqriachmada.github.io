"use client";
import React from "react";
import Link from "next/link";
import profile from "@/public/images/profile.jpg";
import { Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentWork } from "@/lib/workApi";
import { fetchSocials } from "@/lib/socialApi";
import { fallbackLinks } from "@/data/homeItems";
import { SocialIcon } from "@/components/socials/socialIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

function AboutCard() {
  const { data: currentWorkResponse } = useQuery({
    queryKey: ["current-work"],
    queryFn: () => fetchCurrentWork(),
  });

  const { data: socialsResponse } = useQuery({
    queryKey: ["public-socials"],
    queryFn: () => fetchSocials(),
  });

  const currentWork = currentWorkResponse?.data;
  const position = currentWork?.position || "Fullstack Developer";
  const socials = socialsResponse?.data;

  // Prioritaskan link dari API CMS, jika belum ada fallback ke default
  const activeSocials =
    socials && socials.length > 0
      ? socials.map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          iconSource: s.iconSource || "radix-ui",
          iconName: s.iconName || "GlobeIcon",
          faIcon: null,
        }))
      : fallbackLinks;

  return (
    <Transition show={true} appear={true}>
      <div className="size-full rounded-xl shadow-lg transition duration-400">
        <div className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 shadow-xl rounded-2xl backdrop-blur-sm">
          <div className="p-6 lg:px-20">
            <div className="pt-5 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-gray-200 dark:border-gray-700">
                <Image
                  src={profile}
                  alt="Achmada Fiqri"
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-start flex-1">
                <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                  Achmada Fiqri
                </h1>
                <h2 className="text-xl font-medium text-blue-600 dark:text-blue-400 mt-1">
                  {position}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                    Next.js & React
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                    Node.js & Express
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
                    PostgreSQL & MySQL
                  </span>
                </div>
              </div>
            </div>

            <div className="text-start py-6 leading-7 space-y-4">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Hi! I am a passionate Fullstack Developer based in Jakarta, Indonesia.
                I enjoy building reliable, performant, and delightful web applications.
              </p>

              {currentWork && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                  <div className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                    Current Engagement
                  </div>
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    {currentWork.position} at{" "}
                    {currentWork.url ? (
                      <a
                        href={currentWork.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline">
                        {currentWork.name}
                      </a>
                    ) : (
                      currentWork.name
                    )}
                  </div>
                  {currentWork.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {currentWork.description}
                    </p>
                  )}
                </div>
              )}
            </div>

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

            {/* Dynamic Socials from CMS */}
            <div className="text-start pt-5">
              <div className="flex gap-6 sm:gap-8 items-center">
                {activeSocials.map((link) => (
                  <div key={link.id} className="cursor-pointer">
                    <Link
                      href={link.url}
                      title={link.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {link.faIcon ? (
                        <FontAwesomeIcon
                          className="hover:scale-110 h-6 transition-transform"
                          icon={link.faIcon}
                        />
                      ) : (
                        <SocialIcon
                          iconSource={link.iconSource}
                          iconName={link.iconName}
                          className="h-6 w-6 hover:scale-110 transition-transform"
                        />
                      )}
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

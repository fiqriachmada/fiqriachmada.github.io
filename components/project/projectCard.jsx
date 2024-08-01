"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import projectItems from "@/data/projectItems";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAppStoreIos,
  faChrome,
  faGooglePlay,
} from "@fortawesome/free-brands-svg-icons";
import Loading from "@/app/loading";

function ProjectCard() {
  const [selectedId, setSelectedId] = useState(null);

  const [open, setOpen] = useState(false);

  const handleOnClick = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleBack = () => {
    setSelectedId(null);
    setOpen(!open);
  };

  const filteredData = selectedId
    ? projectItems.filter((projectItem) => projectItem.id === selectedId)
    : projectItems;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <div className="">
      {selectedId ? (
        <Transition show={open} appear={true}>
          <div
            className={clsx(
              "transition duration-500 ease-in data-[closed]:opacity-0"
            )}>
            {filteredData.map((projectItem, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 lg:p-10 rounded-lg text-gray-600">
                {/* <div className="flex justify-center">
                  <Image
                    width={20}
                    height={20}
                    src={projectItem.image}
                    className="w-full h-full object-fill rounded-t-md"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-start capitalize">
                    {projectItem.title}
                  </div>
                </div> */}
                <Image
                  width={20}
                  height={20}
                  src={projectItem.image}
                  className="w-full h-full rounded-md mt-5 mb-5"
                />
                <p className="mt-5 mb-5 text-justify">
                  {projectItem.description}
                </p>

                <div className="flex space-x-10 text-xl lg:h-10">
                  {projectItem.link && (
                    <a href={projectItem.link} target="_blank">
                      <FontAwesomeIcon
                        className="hover:scale-[110%] h-10"
                        icon={faChrome}
                      />
                    </a>
                  )}
                  {projectItem.googlePlay && (
                    <a href={projectItem.googlePlay}>
                      <FontAwesomeIcon
                        className="hover:scale-[110%] h-10"
                        icon={faGooglePlay}
                      />
                    </a>
                  )}
                  {projectItem.appStore && (
                    <a href={projectItem.appStore}>
                      <FontAwesomeIcon className="h-10" icon={faAppStoreIos} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Transition>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1">
          {filteredData.map((projectItem, index) => (
            <Transition show={!open} appear={true} key={index}>
              <div
                className={clsx(
                  "size-full rounded-xl shadow-lg transition duration-400",
                  "data-[closed]:translate-y-12 data-[closed]:opacity-0",
                  "data-[leave]:duration-500 data-[leave]:ease-in-out",
                  "data-[leave]:data-[closed]:scale-95 data-[leave]:data-[closed]:rotate-[0deg]"
                )}>
                <div
                  onClick={() => handleOnClick(projectItem.id)}
                  className="bg-gray-200 cursor-pointer text-black shadow-xl rounded-md mt-5 hover:opacity-70 hover:shadow-xl hover:scale-[102%] hover:rounded-md hover:text-gray-700 hover:font-medium"
                  key={index}>
                  <div className="flex justify-center">
                    {/* <Link href={"project/" + projectItem.id}> */}
                    <Image
                      width={20}
                      height={20}
                      src={projectItem.image}
                      className="w-full h-full object-fill rounded-t-md"
                    />
                    {/* </Link> */}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-start capitalize">
                      {/* <Link href={"project/" + projectItem.id}> */}
                      {projectItem.title}
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          ))}
        </div>
      )}
      {selectedId && (
        <button
          onClick={handleBack}
          className="bg-black text-white dark:bg-white dark:text-black font-bold px-4 py-2 my-4 rounded-lg">
          Back
        </button>
      )}
    </div>
  );
}

export default ProjectCard;

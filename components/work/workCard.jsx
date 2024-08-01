"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";

function WorkCard({ data }) {
  const router = useRouter();
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
    ? data.filter((workItem) => workItem.id === selectedId)
    : data;

  return (
    <div>
      {/* <pre>{JSON.stringify(open, null, 2)}</pre> */}
      {selectedId ? (
        <Transition show={open} appear={true}>
          <div className="transition duration-500 ease-in data-[closed]:opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs lg:text-sm">
            {filteredData.map((workItem, index) => (
              <div
                onClick={() => handleOnClick(workItem.id)}
                key={index}
                className="grid grid-cols-1 lg:flex items-center bg-gray-200 text-black rounded-lg lg:px-10 gap-3">
                <div className="mx-4 my-4 lg:mx-0 flex justify-center">
                  <img
                    className="object-contain w-full lg:w-[100px] h-full rounded-lg"
                    src={
                      workItem.imageUrl ||
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                    }
                  />
                </div>
                <div className="m-8 lg:m-0 lg:px-10 lg:py-10 space-y-2">
                  <div>Company Name:</div>
                  <div>{workItem.name}</div>
                  <div>Title:</div>
                  <div>{workItem.description}</div>
                  <div>Start Date:</div>
                  <div>{dayjs(workItem.startDate).format("DD/MM/YYYY")}</div>
                  <div>End Date:</div>
                  <div>{dayjs(workItem.endDate).format("DD/MM/YYYY")}</div>
                </div>
              </div>
            ))}
          </div>
        </Transition>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs lg:text-sm">
          {filteredData.map((workItem, index) => (
            <Transition show={!open} appear={true}>
              <div
                className={clsx(
                  "size-full rounded-xl bg-white shadow-lg transition duration-400",
                  // "data-[closed]:scale-50 data-[closed]:rotate-[-120deg] data-[closed]:opacity-0",
                  "data-[closed]:translate-y-12 data-[closed]:opacity-0",
                  "data-[leave]:duration-500 data-[leave]:ease-in-out",
                  "data-[leave]:data-[closed]:scale-95 data-[leave]:data-[closed]:rotate-[0deg]"
                )}>
                <div
                  onClick={() => handleOnClick(workItem.id)}
                  key={index}
                  className="grid grid-cols-1 lg:flex items-center bg-gray-200 text-black rounded-lg lg:px-10 gap-3">
                  <div className="mx-4 my-4 lg:mx-0 flex justify-center">
                    <img
                      className="object-contain w-full lg:w-[100px] h-full rounded-lg"
                      src={
                        workItem.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                      }
                    />
                  </div>
                  <div className="m-8 lg:m-0 lg:px-10 lg:py-10 space-y-2">
                    <div>Company Name:</div>
                    <div>{workItem.name}</div>
                    <div>Title:</div>
                    <div>{workItem.description}</div>
                    <div>Start Date:</div>
                    <div>{dayjs(workItem.startDate).format("DD/MM/YYYY")}</div>
                    <div>End Date:</div>
                    <div>{dayjs(workItem.endDate).format("DD/MM/YYYY")}</div>
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

export default WorkCard;

"use client";
import homeItems from "@/data/homeItems";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { useState } from "react";

function HomeCard() {
  
  const [open, setOpen] = useState(false);
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
          {homeItems.map((homeItem, index) => (
            <div
              className="bg-gray-200 text-gray-700 shadow-xl rounded-md"
              key={index}>
              <div className="p-6 lg:px-20">
                <div className="text-start text-3xl pt-5 font-extrabold">
                  {homeItem.content[0]}
                </div>
                <div className="text-start text-xl font-medium">
                  {homeItem.content[1]}
                </div>
                <div className="text-start py-8 leading-7">
                  {homeItem.content[2]}
                </div>
                <div className="text-start pt-5 ">{homeItem.content[3]}</div>
                <div className="text-start pt-5 ">{homeItem.content[4]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
}

export default HomeCard;

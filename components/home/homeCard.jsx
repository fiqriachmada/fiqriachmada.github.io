"use client";
import homeItems from "@/data/homeItems";
import React from "react";

function HomeCard() {
  const darkTheme =
    global.window.matchMedia("(prefers-color-scheme: dark)").media ===
    "(prefers-color-scheme: dark)";
  console.log("darkTheme", darkTheme);
  return (
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
  );
}

export default HomeCard;

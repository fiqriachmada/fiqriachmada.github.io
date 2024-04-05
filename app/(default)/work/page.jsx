import React from "react";
import { workItems } from "./workItems";


const title = "work";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

function Work() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-10">
        {workItems.map((workItem, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:flex items-center bg-white text-black rounded-lg px-10 gap-3">
            <div className="mx-4 lg:mx-0">
              <img
                className="object-contain "
                src={workItem.image}
                style={{ width: 400, height: 400 }}
              />
            </div>
            <div className="m-8 lg:m-0 lg:px-10 lg:py-10 space-y-2">
              <div className="">Company Name:</div>
              <div>{workItem.company}</div>
              <div className="">Title:</div>
              <div>{workItem.title}</div>
              <div className="">Start Date:</div>
              <div>{workItem.startDate}</div>
              <div className="">End Date:</div>
              <div>{workItem.endDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;

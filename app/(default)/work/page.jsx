import React from "react";
import { workItems } from "./components/workItems";

const workItem = workItems.map((workItem) => workItem.company);

function Work() {
  return (
    <div>
      Work History
      <div className=" grid grid-cols-1 space-y-10 my-10">
        {workItems.map((workItem) => (
          <div className="flex items-center bg-white text-black rounded-lg p-12 gap-3">
            <img src={workItem.image} style={{ width: 400, height: 400 }} />
            <div className="px-10 py-10 space-y-2">
              <div className="">Company Name:</div>
              <div>{workItem.company}</div>
              <div className="">Start Date:</div>
              <div>{workItem.startDate}</div>
              <div className="">End Date:</div>
              <div>{workItem.endDate}</div>
              <div className="">Title:</div>
              <div>{workItem.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;

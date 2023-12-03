import React from "react";
import { workItems } from "./components/workItems";

const workItem = workItems.map((workItem) => workItem.company);

function Work() {
  return (
    <div>
      Work History
      <div className="flex-col space-y-10 my-10">
        {workItems.map((workItem) => (
          <div className="bg-white text-black rounded-lg">
            <img src={workItem.image} style={{ width: 400, height: 400 }} />
            <div className="px-10 py-10 ">
              Company Name:
              <div>{workItem.company}</div>
              Start Date:
              <div>{workItem.startDate}</div>
              End Date:
              <div>{workItem.endDate}</div>
              Title:
              <div>{workItem.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;

import React from "react";
import { workItems } from "./workItems";
import { fetchWorkData } from "@/lib/fetchWorkData";
import dayjs from "dayjs";

const title = "work";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

async function Work() {
  // { data, error }
  let data = [];
  let error = null;

  try {
    data = await fetchWorkData();
  } catch (err) {
    error = err.message;
  }
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <div className="grid grid-cols-1 gap-10">
        {data.data.map((workItem, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:flex items-center bg-white text-black rounded-lg px-10 gap-3">
            <div className="mx-4 lg:mx-0">
              <img
                className="object-contain "
                src={workItem.imageUrl}
                style={{ width: 400, height: 400 }}
              />
            </div>
            <div className="m-8 lg:m-0 lg:px-10 lg:py-10 space-y-2">
              <div className="">Company Name:</div>
              <div>{workItem.name}</div>
              <div className="">Title:</div>
              <div>{workItem.title}</div>
              <div className="">Start Date:</div>
              <div>{dayjs(workItem.startDate).format("DD/MM/YYYY")}</div>
              <div className="">End Date:</div>
              <div>{dayjs(workItem.endDate).format("DD/MM/YYYY")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;

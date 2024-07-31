"use client";
import { useRouter } from "next/navigation";
import React from "react";
import dayjs from "dayjs";

function WorkCard({ data }) {
  const router = useRouter();
  // const handleOnClick = (id) => {
  //   router.push("/work/" + id);
  // };
  return (
    <div className="grid grid-cols-1 gap-10">
      {data?.map((workItem, index) => (
        <div
          onClick={() => handleOnClick(workItem.id)}
          key={index}
          className="grid grid-cols-1 lg:flex items-center bg-gray-200 text-black rounded-lg px-10 gap-3">
          <div className="mx-4 lg:mx-0">
            <img
              className="object-contain "
              src={
                workItem.imageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
              }
              style={{ width: 400, height: 400 }}
            />
          </div>
          <div className="m-8 lg:m-0 lg:px-10 lg:py-10 space-y-2">
            <div className="">Company Name:</div>
            <div>{workItem.name}</div>
            <div className="">Title:</div>
            <div>{workItem.description}</div>
            <div className="">Start Date:</div>
            <div>{dayjs(workItem.startDate).format("DD/MM/YYYY")}</div>
            <div className="">End Date:</div>
            <div>{dayjs(workItem.endDate).format("DD/MM/YYYY")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorkCard;

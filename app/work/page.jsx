import WorkCard from "@/components/work/workCard";
import { fetchWorkData } from "@/lib/workApi";
import React from "react";

async function Work() {
  var data = [];
  try {
    data = await fetchWorkData();
  } catch (error) {
    console.log("error", error);
  }
  return (
    <div>
      <WorkCard data={data.data} />
    </div>
  );
}

export default Work;

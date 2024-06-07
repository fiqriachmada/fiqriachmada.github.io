import React from "react";
import { workItems } from "./workItems";
import { fetchWorkData } from "@/lib/fetchWorkData";

import WorkCard from "@/components/work/workCard";

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
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}
      <div className="grid grid-cols-1 gap-10">
        <WorkCard data={data.data} />
      </div>
    </div>
  );
}

export default Work;

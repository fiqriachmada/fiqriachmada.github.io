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
    <div className="10">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <WorkCard data={data.data} />
    </div>
  );
}

export default Work;

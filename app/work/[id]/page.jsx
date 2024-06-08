import React from "react";

import { fetchWorkData, fetchWorkDataById } from "@/lib/workApi";
import WorkCardDetail from "@/components/work/detail/workCardDetail";

const title = "detail work";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

export async function generateStaticParams() {
  const data = await fetchWorkData();
  return data.data;
}

async function Detail(params) {
  const id = params.params.id;

  var data = [];
  try {
    data = await fetchWorkDataById(id);
  } catch (error) {
    console.log("error", error);
  }
  return (
    <div>
      <WorkCardDetail data={data.data} />
    </div>
  );
}

export default Detail;

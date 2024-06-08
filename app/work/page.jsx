import { fetchWorkData } from "@/lib/workApi";
import React from "react";

async function page() {
  var data = [];
  try {
    data = await fetchWorkData();
  } catch (error) {
    console.log("error", error);
  }
  return (
    <div>
      page
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default page;

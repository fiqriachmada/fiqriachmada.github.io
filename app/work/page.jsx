import WorkCard from "@/components/work/workCard";
import { fetchWorkData } from "@/lib/workApi";
import React from "react";


// async function getWorkDataData() {
//   const cookieData = cookies().getAll();
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(cookieData);
//     }, 1000)
//   );
// }
// async function getCookieData() {
//   const fetchWorkDataPromise = fetchWorkData().catch((error) => {
//     console.log("Error fetching work data:", error);
//     return []; // Return empty array if fetch fails
//   });

//   // Wait for both cookieData and fetchWorkData to resolve
//   const [workData] = await Promise.all([fetchWorkDataPromise]);

//   return { workData };
// }

async function page() {
//   const { cookies, workData } = await getCookieData();
  var data = [];
  try {
    data = await fetchWorkData();
  } catch (error) {
    console.log("error", error);
  }
  return (
    <div>
      page
      {/* <pre>{JSON.stringify(cookies, null, 2)}</pre>
      <pre>{JSON.stringify(workData, null, 2)}</pre> */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <WorkCard data={data.data} />
    </div>
  );
}

export default page;

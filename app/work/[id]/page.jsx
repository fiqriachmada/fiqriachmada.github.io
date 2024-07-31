import React from "react";
import { fetchWorkData, fetchWorkDataById } from "@/lib/workApi";
import WorkCardDetail from "@/components/work/detail/workCardDetail";

const title = "detail work";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

export async function generateStaticParams() {
  const response = await fetchWorkData();

  // Check if data is present and format correctly
  if (!response.data) {
    return [];
  }

  return response.data.map((item) => ({
    params: { id: item.id },
  }));
}

async function Detail({ params }) {
  // const { id } = params;
  // let data = null;
  // let error = null;

  // try {
  //   const result = await fetchWorkDataById(id);
  //   data = result.data;
  // } catch (err) {
  //   console.error("Failed to fetch data:", err);
  //   error = err;
  // }

  // if (error) return <div>Error loading data.</div>;
  // if (!data) return <div>Loading...</div>;

  return (
    <div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <WorkCardDetail
      // data={data}
      />
    </div>
  );
}

export default Detail;

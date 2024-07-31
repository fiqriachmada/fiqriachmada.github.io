'use client'
import WorkCard from "@/components/work/workCard";
import { fetchWorkData } from "@/lib/workApi";
import React, { useEffect, useState } from "react";

function Work() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchWorkData();
        setData(result.data);
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <WorkCard data={data} />
    </div>
  );
}

export default Work;

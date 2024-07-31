'use client'
import WorkCard from "@/components/work/workCard";
import { fetchWorkData } from "@/lib/workApi";
import React, { useEffect, useState } from "react";

function Work() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchWorkData();
        setData(result.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or an error occurs
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading...</p>
      ) : (
        <WorkCard data={data} />
      )}
    </div>
  );
}

export default Work;
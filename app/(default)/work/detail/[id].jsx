// [id].jsx

import { fetchWorkDataById } from "@/lib/fetchWorkDataById";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { fetchWorkById } from "../../lib/api"; // Assuming you have a function to fetch work data by ID

export default function WorkDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  console.log('id', id)
  const [work, setWork] = useState(null);

  useEffect(() => {
    if (id) {
      fetchWorkDataById(id)
        .then((data) => setWork(data))
        .catch((error) => console.error("Error fetching work:", error));
    }
  }, [id]);

  if (!work) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{work.title}</h1>
      <p>{work.description}</p>
      {/* Include other details about the work */}
    </div>
  );
}

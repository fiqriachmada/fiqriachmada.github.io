// "use client";

// import { usePathname, useRouter } from "next/navigation";
import React from "react";
import projectItems from "../projectItems";

import DetailProjectPage from "./components/detail";

export function generateStaticParams() {
  const id = projectItems;

  return id;
}

function Detail(params) {
  const id = params.params.id;
  

  const detailItem = projectItems.find((item) => item.id.toString() === id);

  return (
    <div>
      {detailItem ? (
        <DetailProjectPage detailItem={detailItem} />
      ) : (
        <p>Item with ID {id} not found.</p>
      )}
    </div>
  );
}

export default Detail;

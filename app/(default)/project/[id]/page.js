"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import projectItems from "../projectItems";

import DetailProjectPage from "./components/detail";

function Detail() {
  const router = useRouter();

  const path = usePathname();

  const id = path.split("/").pop();

  const detailItem = projectItems.find(
    (item) => item.id.toString() === id.toString()
  );

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

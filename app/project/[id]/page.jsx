import React from "react";
import projectItems from "../../../data/projectItems";

import DetailProjectPage from "../../../components/project/detail/detail";

export function generateStaticParams() {
  const id = projectItems;

  return id;
}

const title = "project";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site",
};

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

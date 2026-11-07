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

async function Detail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

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

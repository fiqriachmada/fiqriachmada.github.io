'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import projectItems from '../projectItems';

function Detail() {
  const router = useRouter();

  const path = usePathname();

  const id = path.split('/').pop();

  const detailItem = projectItems.find(
    (item) => item.id.toString() === id.toString()
  );

  return (
    <div>
      {detailItem ? (
        <div>
          <h2>{detailItem.title}</h2>
          <img src={detailItem.image} className='rounded-md mt-5 mb-5' />

          <p className='mt-5 mb-5 text-justify'>{detailItem.description}</p>
          <a href={detailItem.link}>{detailItem.link}</a>
          <a href={detailItem.googlePlay}>{detailItem.googlePlay}</a>
          <a href={detailItem.appStore}>{detailItem.appStore}</a>
        </div>
      ) : (
        <p>Item with ID {id} not found.</p>
      )}
    </div>
  );
}

export default Detail;

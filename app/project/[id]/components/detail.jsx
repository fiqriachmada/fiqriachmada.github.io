import {
  faAppStoreIos,
  faChrome,
  faGooglePlay,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import React from "react";



function DetailProjectPage(props) {
  const { detailItem } = props;
  return (
    <div className="bg-gray-200 p-4 lg:p-10 rounded-lg text-gray-600">
      {/* <h2>{detailItem.title}</h2> */}
      <Image
        width={20}
        height={20}
        src={detailItem.image}
        className="w-full h-full rounded-md mt-5 mb-5"
      />
      <p className="mt-5 mb-5 text-justify">{detailItem.description}</p>

      <div className="flex space-x-10 text-xl lg:h-10">
        {detailItem.link && (
          <a href={detailItem.link} target="_blank">
            <FontAwesomeIcon className="hover:scale-[110%] h-10" icon={faChrome} />
          </a>
        )}
        {detailItem.googlePlay && (
          <a href={detailItem.googlePlay}>
            <FontAwesomeIcon className="hover:scale-[110%] h-10" icon={faGooglePlay} />
          </a>
        )}
        {detailItem.appStore && (
          <a href={detailItem.appStore}>
            <FontAwesomeIcon className="h-10" icon={faAppStoreIos} />
          </a>
        )}
      </div>
    </div>
  );
}

export default DetailProjectPage;

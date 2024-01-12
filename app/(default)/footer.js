"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import headerItems from "@/data/headerItems";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import socialMediaItems from "./socialMediaItems";

function Footer() {
  const [activeLink, setActiveLink] = useState("");
  const [isShowing, setIsShowing] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const handleClick = () => {
    router.push("/");
  };

  useEffect(() => {
    setActiveLink(pathname);
  });

  const handleClickFooter = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="h-auto lg:h-40">
      <div className="flex justify-between ">
        <div className="sm:items-center mt-3 mb-3">
          <img
            className="block h-8 w-auto lg:hidden"
            src="https://svgshare.com/i/tmn.svg"
            alt="fiqriachmada-logo"
            onClick={() => {
              handleClick();
            }}
          />
          <img
            className="hidden h-8 w-auto lg:block"
            src="https://svgshare.com/i/tmn.svg"
            alt="fiqriachmada-logo"
            onClick={() => {
              handleClick();
            }}
          />
        </div>
        <div className="mt-3 mb-3">
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              {headerItems.map((headerItem, index) => (
                <Link
                  key={index}
                  onClick={() => handleClickFooter(headerItem.link)}
                  href={headerItem.link}
                  className={`${activeLink === headerItem.link && "bg-gray-900"}
                  
                 ${activeLink != headerItem.link && "hover:bg-slate-500"}
                  text-white rounded-md px-3 py-2 text-sm font-medium capitalize`}>
                  {headerItem.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-3 mb-3">
          {/* <!-- Mobile menu button--> */}
          <button
            onClick={() => setIsShowing((isShowing) => !isShowing)}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            {isShowing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="sm:hidden" id="mobile-menu">
        <Transition
          show={isShowing}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          {/* <div className="space-y-1 px-2 pb-3 pt-2"> */}
          <div className="space-y-1 pb-3">
            {headerItems.map((headerItem, index) => (
              <Link
                key={index}
                href={headerItem.link}
                onClick={() => handleClickFooter(headerItem.link)}
                className={`  
                ${activeLink === headerItem.link && "bg-gray-900"}
                 ${activeLink != headerItem.link && "hover:bg-slate-500"}
                text-white block rounded-md px-3 py-2 text-base font-medium capitalize`}>
                {headerItem.title}
              </Link>
            ))}
          </div>
        </Transition>
      </div>

      <ul className="flex justify-center md:justify-end md:mt-12 mt-auto pb-5">
        {socialMediaItems.map((item, index) => (
          <li className="ml-4" key={index}>
            <a
              href={item.link}
              className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-slate-300 hover:bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
              aria-label={item.text}>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg">
                <path d={item.svgPatch} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;

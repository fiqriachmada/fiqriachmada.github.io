"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import routes from "@/routes/routes";

function Header() {
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

  const handleClickHeader = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="">
      {/* desktop */}
      <div className="flex justify-between items-center px-4 py-0 lg:px-6 lg:py-4">
        <div className="" onClick={handleClick}>
          <Link href={"/"}>
            <img
              className="block h-8 w-auto lg:hidden"
              src="https://svgshare.com/i/tmn.svg"
              alt="fiqriachmada-logo"
            />
            <img
              className="hidden h-8 w-auto lg:block"
              src="https://svgshare.com/i/tmn.svg"
              alt="fiqriachmada-logo"
            />
          </Link>
        </div>

        <div className="hidden lg:block">
          <div className="flex space-x-4">
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.link}
                onClick={() => {
                  handleClickHeader(route.link);
                }}
                //   className={`${activeLink === route.link && "bg-gray-900"}
                //  ${activeLink != route.link && "hover:bg-slate-500"}
                //   text-white rounded-md px-3 py-2 text-sm font-bold capitalize`}
                className={`${
                  pathname.startsWith(route.link) &&
                  // activeLink.startsWith()
                  "bg-gray-900 font-extrabold"
                }
                 ${
                   !pathname.startsWith(route.link) &&
                   "hover:bg-slate-500 hover:font-bold"
                 }
                  text-white rounded-md px-3 py-2 text-sm font-medium capitalize`}>
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:hidden mt-3 mb-3">
          {/* <!-- Mobile menu button--> */}
          <button
            onClick={() => setIsShowing((isShowing) => !isShowing)}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400
             hover:bg-gray-700
              hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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

      {/* mobile */}
      <div className="lg:hidden" id="mobile-menu">
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
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.link}
                onClick={() => handleClickHeader(route.link)}
                className={`
                ${pathname.startsWith(route.link) && "bg-gray-900"}
                 ${
                   !pathname.startsWith(route.link) && "hover:bg-slate-500"
                 } text-white block rounded-md px-3 py-2 text-base font-bold capitalize`}>
                {route.title}
              </Link>
            ))}
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default Header;

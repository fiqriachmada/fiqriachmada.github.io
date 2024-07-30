"use client";
import routes from "@/routes/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import ThemeButton from "../button/themeButton";

function DesktopHeader() {
  const router = useRouter();

  const pathname = usePathname();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="hidden lg:block">
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

        <div className="">
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

        <div>
          <ThemeButton />
        </div>
      </div>
    </div>
  );
}

export default DesktopHeader;

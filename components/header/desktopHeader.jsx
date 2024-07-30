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

  const isActive = (route) => pathname.startsWith(route.link);

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
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.link}
                onClick={() => {
                  handleClickHeader(route.link);
                }}
                className={`${
                  isActive(route) &&
                  // activeLink.startsWith()
                  "bg-gray-900 dark:text-darkText text-darkText font-extrabold"
                }
                 ${
                   !isActive(route) &&
                   "hover:bg-slate-500  dark:text-darkText text-lightText hover:font-bold"
                 }
                    rounded-md px-3 py-2 text-sm font-medium capitalize`}>
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

"use client";
import routes from "@/routes/routes";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import type { Route } from "@/types/route";
import ThemeButton from "../button/themeButton";

function DesktopHeader() {
  const router = useRouter();

  const pathname = usePathname();

  const handleClick = () => {
    router.push("/");
  };

  const isActive = (route: Route) => pathname.startsWith(route.link);

  return (
    <div className="hidden lg:block">
      <div className="flex justify-between items-center px-4 py-0 lg:px-6 lg:py-4">
        <div className="" onClick={handleClick}>
          <Link href={"/"}>
            <Image
              className="block h-8 w-auto lg:hidden"
              src="/icon.svg"
              alt="fiqriachmada-logo"
              width={32}
              height={32}
              unoptimized
            />
            <Image
              className="hidden h-8 w-auto lg:block"
              src="/icon.svg"
              alt="fiqriachmada-logo"
              width={32}
              height={32}
              unoptimized
            />
          </Link>
        </div>

        <div className="">
          <div className="flex space-x-4">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.link}
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

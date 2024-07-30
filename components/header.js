"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import routes from "@/routes/routes";
import DesktopHeader from "./header/desktopHeader";
import MobileHeader from "./header/mobileHeader";

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
    <div className="fixed top-0 right-0 left-0 z-10 mx-6 lg:mx-28 my-5 dark:bg-gray-800 bg-black  mb-16 rounded-xl hover:scale-[101%]">
      {/* desktop */}
      <DesktopHeader />
      <MobileHeader />
    </div>
  );
}

export default Header;

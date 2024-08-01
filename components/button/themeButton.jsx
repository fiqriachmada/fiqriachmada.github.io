"use client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeButton() {
  const { theme, themes, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Handler untuk klik di luar menu
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  const isActive = (option) => theme.startsWith(option);

  const handleOnClick = () => {
    setOpen(!open);
  };

  return (
    <div className="">
      {/* Desktop */}
      <div className="hidden lg:block relative">
        <button
          ref={buttonRef}
          onClick={handleOnClick}
          className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          {theme === "light" ? (
            <SunIcon className="size-4 fill-yellow-300" />
          ) : theme === "dark" ? (
            <MoonIcon className="size-4 fill-white/40" />
          ) : (
            <AdjustmentsHorizontalIcon className="size-4 fill-white/40" />
          )}{" "}
          {theme}
          <ChevronDownIcon
            className={clsx(
              "size-4 fill-white/60",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        <Transition
          show={open}
          as="div"
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <div
            ref={menuRef}
            className={clsx(
              "absolute right-0 bg-darkBg dark:bg-lightBg text-darkText dark:text-lightText z-10 my-2 p-1 origin-top-right rounded-xl w-36 transition duration-500 ease-out space-y-1"
            )}>
            {themes.map((option, index) => (
              <div key={index}>
                <button
                  onClick={() => {
                    setTheme(option);
                    setOpen(false)
                  }}
                  className={`${
                    isActive(option)
                      ? "font-extrabold bg-gray-900 text-white"
                      : "hover:bg-gray-400 hover:text-darkText"
                  } group flex w-full items-center gap-3 rounded-lg py-1.5 px-3`}>
                  {option === "light" ? (
                    <SunIcon className="size-4 fill-yellow-300" />
                  ) : option === "dark" ? (
                    <MoonIcon
                      className={clsx(
                        "size-4 dark:fill-black fill-white/40",
                        isActive(option) && "fill-white dark:fill-white"
                      )}
                    />
                  ) : (
                    <AdjustmentsHorizontalIcon
                      className={clsx(
                        "size-4  dark:fill-gray-800 fill-white/40",
                        isActive(option) && "fill-white dark:fill-white"
                      )}
                    />
                  )}{" "}
                  {option}
                </button>
              </div>
            ))}
          </div>
        </Transition>
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <div className="flex justify-between gap-2">
          {themes.map((option) => (
            <button
              onClick={() => {
                setTheme(option);
              }}
              className={`${
                isActive(option)
                  ? "font-extrabold bg-gray-900 text-white"
                  : "hover:bg-gray-400 hover:text-darkText"
              } flex justify-center w-full items-center gap-1 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10`}>
              {option === "light" ? (
                <SunIcon className="size-4 fill-yellow-300" />
              ) : option === "dark" ? (
                <MoonIcon
                  className={clsx(
                    "size-4 fill-gray-500 dark:fill-white/40",
                    isActive(option) && "fill-white dark:fill-white"
                  )}
                />
              ) : (
                <AdjustmentsHorizontalIcon
                  className={clsx(
                    "size-4  fill-gray-600 dark:fill-white/40",
                    isActive(option) && "fill-white dark:fill-white"
                  )}
                />
              )}
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

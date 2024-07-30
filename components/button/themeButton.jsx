"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  MoonIcon,
  PencilIcon,
  Square2StackIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { DarkMode, DisplaySettings, WbSunny } from "@mui/icons-material";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  const { theme, themes, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (option) => theme.startsWith(option);

  return (
    <div className="">
      {/* Desktop */}
      <div className="hidden lg:block ">
        <Menu __demoMode>
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            {theme === "light" ? (
              <SunIcon className="size-4 fill-yellow-300" />
            ) : theme === "dark" ? (
              <MoonIcon className="size-4 fill-white/40" />
            ) : (
              <AdjustmentsHorizontalIcon className="size-4 fill-white/40" />
              // <PrefIcon
              // <DisplaySettings className="text-gray-400" />
            )}{" "}
            {theme}
            <ChevronDownIcon className="size-4 fill-white/60" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="bg-darkBg dark:bg-lightBg text-darkText dark:text-lightText z-10 my-2 p-1 origin-top-right rounded-xl w-36 transition duration-100 ease-out">
            {/* z-10 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 */}
            {themes.map((option) => (
              <MenuItem>
                <button
                  onClick={() => {
                    setTheme(option);
                  }}
                  className="group flex w-full items-center gap-3 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  {option === "light" ? (
                    // <WbSunny className="text-yellow-300" />
                    <SunIcon className="size-4 fill-yellow-300" />
                  ) : option === "dark" ? (
                    <MoonIcon className="size-4 fill-white/40" />
                  ) : (
                    <AdjustmentsHorizontalIcon className="size-4 fill-white/40" />
                  )}{" "}
                  {option}
                </button>
              </MenuItem>
            ))}
            {/* <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <Square2StackIcon className="size-4 fill-white/30" />
              Duplicate
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-white/5" />
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
              Archive
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <TrashIcon className="size-4 fill-white/30" />
              Delete
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem> */}
          </MenuItems>
        </Menu>
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
                // <WbSunny className="text-yellow-300" />
                <SunIcon className="size-4 fill-yellow-300" />
              ) : option === "dark" ? (
                <MoonIcon className="size-4 text-black dark:fill-white/40" />
              ) : (
                <AdjustmentsHorizontalIcon className="size-4 text-gray-800 dark:fill-white/40" />
              )}{" "}
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

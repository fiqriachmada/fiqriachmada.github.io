"use client";
import { Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  SparklesIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const THEME_OPTIONS = [
  {
    id: "light",
    label: "Light",
    group: "standard",
    icon: SunIcon,
    iconColor: "text-amber-500 fill-amber-400",
  },
  {
    id: "dark",
    label: "Dark",
    group: "standard",
    icon: MoonIcon,
    iconColor: "text-indigo-400 fill-indigo-400",
  },
  {
    id: "system",
    label: "System",
    group: "standard",
    icon: AdjustmentsHorizontalIcon,
    iconColor: "text-slate-400 fill-slate-400",
  },
  {
    id: "neo-light",
    label: "Neo Light",
    group: "neo",
    icon: SparklesIcon,
    iconColor: "text-amber-500 fill-amber-400",
  },
  {
    id: "neo-dark",
    label: "Neo Dark",
    group: "neo",
    icon: SparklesIcon,
    iconColor: "text-lime-400 fill-lime-400",
  },
  {
    id: "neo-system",
    label: "Neo System",
    group: "neo",
    icon: SparklesIcon,
    iconColor: "text-pink-500 fill-pink-500",
  },
];

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!mounted) {
    return (
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
    );
  }

  const currentOption =
    THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[2];
  const CurrentIcon = currentOption.icon;
  const isNeo = theme?.startsWith("neo-");

  return (
    <div className="relative">
      {/* Desktop Dropdown Trigger */}
      <div className="hidden lg:block relative">
        <button
          onClick={() => setOpen(!open)}
          className={clsx(
            "flex items-center gap-2 rounded-lg py-1.5 px-3 text-xs font-semibold shadow-xs transition-all cursor-pointer",
            isNeo
              ? "bg-[#ff5277] text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000000]"
              : "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90"
          )}
        >
          <CurrentIcon className={clsx("size-4", currentOption.iconColor)} />
          <span>{currentOption.label}</span>
          <ChevronDownIcon
            className={clsx(
              "size-3.5 fill-current transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={menuRef}
            className="absolute right-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-800 z-50 my-2 p-1.5 origin-top-right rounded-xl w-48 shadow-xl space-y-1"
          >
            {/* Standard Themes Group */}
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Standard (3)
            </div>
            {THEME_OPTIONS.filter((t) => t.group === "standard").map(
              (option) => {
                const Icon = option.icon;
                const isSelected = theme === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTheme(option.id);
                      setOpen(false);
                    }}
                    className={clsx(
                      "group flex w-full items-center justify-between gap-2.5 rounded-lg py-1.5 px-2.5 text-xs transition cursor-pointer",
                      isSelected
                        ? "bg-gray-900 dark:bg-gray-800 text-white font-bold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={clsx("size-4", option.iconColor)} />
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              }
            )}

            {/* Neo Brutalism Themes Group */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-1 pt-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-500 font-extrabold flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-pink-500" />
                <span>Neo Brutalism (3)</span>
              </div>
              {THEME_OPTIONS.filter((t) => t.group === "neo").map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTheme(option.id);
                      setOpen(false);
                    }}
                    className={clsx(
                      "group flex w-full items-center justify-between gap-2.5 rounded-lg py-1.5 px-2.5 text-xs transition cursor-pointer",
                      isSelected
                        ? "bg-pink-500 text-white font-bold shadow-xs"
                        : "hover:bg-pink-50 dark:hover:bg-pink-950/30 text-gray-800 dark:text-gray-100 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={clsx("size-4", option.iconColor)} />
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Transition>
      </div>

      {/* Mobile Selector */}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-1">
            {THEME_OPTIONS.filter((t) => t.group === "standard").map(
              (option) => {
                const Icon = option.icon;
                const isSelected = theme === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={clsx(
                      "flex items-center justify-center gap-1 rounded-md py-1 px-1.5 text-[10px] transition cursor-pointer",
                      isSelected
                        ? "bg-gray-900 dark:bg-gray-800 text-white font-bold"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className={clsx("size-3", option.iconColor)} />
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              }
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-gray-200 dark:border-gray-800">
            {THEME_OPTIONS.filter((t) => t.group === "neo").map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={clsx(
                    "flex items-center justify-center gap-1 rounded-md py-1 px-1.5 text-[10px] transition cursor-pointer",
                    isSelected
                      ? "bg-pink-500 text-white font-bold"
                      : "text-pink-600 dark:text-pink-400 hover:opacity-80"
                  )}
                >
                  <Icon className={clsx("size-3", option.iconColor)} />
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import routes from "@/routes/routes";
import type { Route } from "@/types/route";
import ThemeButton from "@/components/button/themeButton";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  Menu,
  X,
  Home,
  User,
  FolderGit2,
  Briefcase,
  BookOpen,
} from "lucide-react";

const getRouteIcon = (title: string) => {
  switch (title?.toLowerCase()) {
    case "about":
      return <User className="size-4" />;
    case "project":
      return <FolderGit2 className="size-4" />;
    case "work":
      return <Briefcase className="size-4" />;
    case "blog":
      return <BookOpen className="size-4" />;
    default:
      return <Home className="size-4" />;
  }
};

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isActive = (route: Route) => pathname.startsWith(route.link);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none"
    >
      {/* Expanded Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-3 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-3 scale-95"
      >
        <div className="mb-3 w-64 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 shadow-2xl p-3 space-y-3">
          {/* Logo / Brand header */}
          <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 group"
            >
              <img
                src="/icon.svg"
                alt="fiqriachmada"
                className="h-6 w-auto transition-transform group-hover:scale-110"
              />
              <span className="text-xs font-bold tracking-wide text-gray-800 dark:text-gray-100 group-hover:text-blue-500">
                fiqriachmada
              </span>
            </Link>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Nav
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                pathname === "/"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70"
              )}
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>

            {routes.map((route, index) => {
              const active = isActive(route);
              return (
                <Link
                  key={index}
                  href={route.link}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                    active
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getRouteIcon(route.title)}
                    <span className="capitalize">{route.title}</span>
                  </div>
                  {active && (
                    <span className="size-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Theme Switcher section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Theme
            </div>
            <ThemeButton />
          </div>
        </div>
      </Transition>

      {/* Floating Action Button Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        className={clsx(
          "relative flex items-center justify-center size-14 rounded-full shadow-xl transition-all duration-300 cursor-pointer",
          "focus:outline-hidden focus:ring-4 focus:ring-blue-500/30",
          isOpen
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 rotate-90 scale-105"
            : "bg-gray-900/90 text-white dark:bg-gray-800/90 dark:text-white hover:scale-110 active:scale-95 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-2xl"
        )}
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
    </div>
  );
};

export default FloatingNav;

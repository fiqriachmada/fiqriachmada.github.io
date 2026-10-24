"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/**
 * Skeleton loader designed to accurately match each page's real UI layout
 * (Home, Work, Project, Blog, About) with dark/neo theme support.
 */
export default function Loading() {
  const pathname = usePathname();

  // 1. /work layout: 2-column cards with logo box + title + subtitle + date
  if (pathname?.startsWith("/work")) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-5 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"></div>
              <div className="flex-1 space-y-2.5">
                <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 w-56 max-w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. /project layout: Switcher bar + 2-column showcase cards
  if (pathname?.startsWith("/project")) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-52 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-4 w-80 max-w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-5 shadow-sm flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>
              <div className="flex-1 space-y-2.5">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. /blog layout: 3-column article cards with aspect-video image covers
  if (pathname?.startsWith("/blog")) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-88 max-w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-4 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-full aspect-video rounded-xl bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-5 w-4/5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. /about layout: Large profile photo + bio + experiences & skills
  if (pathname?.startsWith("/about")) {
    return (
      <div className="size-full rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 shadow-xl p-6 lg:px-20 animate-pulse">
        <div className="pt-5 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gray-200 dark:bg-gray-800 shrink-0"></div>
          <div className="flex-1 space-y-4 w-full">
            <div className="h-8 w-60 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-5 w-44 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-3.5 w-11/12 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-3.5 w-4/5 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="flex gap-4 pt-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Default / Home page layout: Hero card with avatar placeholder, name, badge, and description
  return (
    <div className="size-full rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 shadow-xl p-6 lg:px-20 animate-pulse">
      <div className="space-y-6 pt-5">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="h-7 w-64 rounded-full bg-gray-200 dark:bg-gray-800"></div>

        <div className="space-y-2.5 py-2">
          <div className="h-4 w-full max-w-xl bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-4 w-5/6 max-w-lg bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="pt-4 flex gap-4">
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}

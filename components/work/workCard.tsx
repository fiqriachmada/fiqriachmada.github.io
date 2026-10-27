"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkData } from "@/lib/workApi";
import {
  Building2,
  Calendar,
  Car,
  ExternalLink,
  Flag,
  LayoutGrid,
  MapPin,
  Route,
} from "lucide-react";
import { useWorkViewStore } from "@/store/work-store";

const FALLBACK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

function WorkCard() {
  const {
    selectedWorkId: selectedId,
    setSelectedWorkId: setSelectedId,
    viewMode,
    setViewMode,
  } = useWorkViewStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-works"],
    queryFn: () => fetchWorkData({ limit: 50 }),
  });

  const works = data?.data || [];

  const handleOnClick = (id: string) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  if (isLoading || !hydrated) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <p className="font-semibold">Failed to load work experience</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {error?.message || "CMS API connection error"}
        </p>
      </div>
    );
  }

  const selectedWork = selectedId
    ? works.find((w) => w.id === selectedId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Work Experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Professional career roadmap, engineering milestones, and leadership journey.
          </p>
        </div>

        {!selectedWork && (
          <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-1 shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setViewMode("card")}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                viewMode === "card"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}>
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>

            <button
              onClick={() => setViewMode("timeline")}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                viewMode === "timeline"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}>
              <Route className="w-3.5 h-3.5" />
              <span>Road Timeline</span>
            </button>
          </div>
        )}
      </div>

      {selectedWork ? (
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 lg:p-10 rounded-2xl text-gray-800 dark:text-gray-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-2 border border-gray-200 dark:border-gray-800 shadow-sm"
              src={selectedWork.imageUrl || FALLBACK_LOGO}
              alt={selectedWork.name}
              width={80}
              height={80}
              unoptimized
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedWork.name}
                </h2>
                {!selectedWork.endDate && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Current Stop
                  </span>
                )}
              </div>
              {selectedWork.position && (
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {selectedWork.position}
                </p>
              )}
              {selectedWork.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {selectedWork.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {dayjs(selectedWork.startDate).format("MMMM YYYY")} —{" "}
                  {selectedWork.endDate
                    ? dayjs(selectedWork.endDate).format("MMMM YYYY")
                    : "Present"}
                </span>
                {selectedWork.url && (
                  <Link
                    href={selectedWork.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    <span>Visit Company</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleBack}
              className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
              ← Back to Work Experience
            </button>
          </div>
        </div>
      ) : viewMode === "timeline" ? (
        /* Car Track / Road Highway Timeline */
        <div className="relative py-8 px-2 sm:px-4">
          {/* Top Destination Banner */}
          <div className="flex items-center justify-start md:justify-center mb-8 pl-2 sm:pl-0">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-500/50 bg-zinc-900 text-amber-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
              <Car className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Current Destination • Active Lane</span>
            </div>
          </div>

          <div className="relative">
            {/* Asphalt Road Track with Dashed Center Line */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-8 rounded-full bg-zinc-800 dark:bg-zinc-900 border-x-[3px] border-amber-400/80 shadow-inner flex justify-center overflow-hidden">
              <div className="h-full w-0 border-l-2 border-dashed border-white/75" />
            </div>

            <div className="space-y-10 relative z-10">
              {works.map((workItem, idx) => {
                const isEven = idx % 2 === 0;
                const isActive = !workItem.endDate;

                return (
                  <div
                    key={workItem.id}
                    className={clsx(
                      "relative flex flex-col md:flex-row items-start md:items-center",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}>
                    {/* Card Container */}
                    <div
                      className={clsx(
                        "w-full pl-16 md:pl-0 md:w-1/2",
                        isEven ? "md:pr-12" : "md:pl-12"
                      )}>
                      <div
                        onClick={() => handleOnClick(workItem.id)}
                        className="group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/60 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-700 shadow-xs">
                            <Image
                              className="w-full h-full object-contain rounded-lg"
                              src={workItem.imageUrl || FALLBACK_LOGO}
                              alt={workItem.name}
                              width={64}
                              height={64}
                              unoptimized
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                                <MapPin className="w-3 h-3" />
                                Stop #{works.length - idx}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {dayjs(workItem.startDate).format("MMM YYYY")} –{" "}
                                {workItem.endDate
                                  ? dayjs(workItem.endDate).format("MMM YYYY")
                                  : "Present"}
                              </span>
                            </div>

                            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {workItem.name}
                            </h3>

                            {workItem.position && (
                              <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                {workItem.position}
                              </p>
                            )}

                            {workItem.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 line-clamp-2">
                                {workItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Road Checkpoint / Car Marker on the Highway */}
                    <button
                      type="button"
                      onClick={() => handleOnClick(workItem.id)}
                      title={`View ${workItem.name}`}
                      className={clsx(
                        "absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center rounded-full border-2 transition-transform hover:scale-110 shadow-md",
                        isActive
                          ? "w-10 h-10 bg-amber-400 text-zinc-950 border-white ring-4 ring-amber-400/30"
                          : "w-9 h-9 bg-zinc-900 text-white border-amber-400 hover:bg-amber-400 hover:text-zinc-950"
                      )}>
                      <Car className="w-4 h-4" />
                    </button>

                    {/* Spacer for opposite lane on Desktop */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Origin / Starting Line Banner */}
          <div className="flex items-center justify-start md:justify-center mt-8 pl-2 sm:pl-0">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-700 bg-zinc-900 text-zinc-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md">
              <Flag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Career Starting Line • Origin</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((workItem) => (
            <div
              key={workItem.id}
              onClick={() => handleOnClick(workItem.id)}
              className={clsx(
                "group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
              )}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-700 shadow-xs">
                <Image
                  className="w-full h-full object-contain rounded-lg"
                  src={workItem.imageUrl || FALLBACK_LOGO}
                  alt={workItem.name}
                  width={80}
                  height={80}
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{workItem.name}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {workItem.position || workItem.description}
                </h3>

                {workItem.position && workItem.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {workItem.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {dayjs(workItem.startDate).format("MMM YYYY")} –{" "}
                    {workItem.endDate
                      ? dayjs(workItem.endDate).format("MMM YYYY")
                      : "Present"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkCard;

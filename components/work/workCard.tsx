"use client";

import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import clsx from "clsx";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkData } from "@/lib/workApi";
import { Building2, Calendar } from "lucide-react";

const FALLBACK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

function WorkCard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <p className="font-semibold">Gagal memuat riwayat pekerjaan</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {error?.message || "Terjadi kesalahan koneksi API CMS"}
        </p>
      </div>
    );
  }

  const selectedWork = selectedId
    ? works.find((w) => w.id === selectedId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Work Experience
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Jejak karier, pengalaman profesional, dan peran kepemimpinan rekayasa teknologi.
        </p>
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
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedWork.name}
              </h2>
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
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {dayjs(selectedWork.startDate).format("MMMM YYYY")} —{" "}
                  {selectedWork.endDate
                    ? dayjs(selectedWork.endDate).format("MMMM YYYY")
                    : "Present"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleBack}
              className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
              ← Kembali ke Daftar
            </button>
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

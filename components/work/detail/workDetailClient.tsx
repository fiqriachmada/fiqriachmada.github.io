"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Loading from "@/app/loading";
import { fetchWorkDataById } from "@/lib/workApi";
import { ArrowLeft, Calendar, ExternalLink, FolderKanban } from "lucide-react";

const FALLBACK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

export default function WorkDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-work-detail", id],
    queryFn: () => fetchWorkDataById(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <Loading />;

  if (isError || !data?.data) {
    return (
      <div className="space-y-4 p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <p className="font-semibold">Failed to load work detail</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {error?.message || "Work not found"}
        </p>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-semibold underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Work Experience
        </Link>
      </div>
    );
  }

  const work: any = data.data;
  const projects: any[] = work.projects || [];
  const startLabel = work.startDate
    ? dayjs(work.startDate).format("MMM YYYY")
    : "";
  const endLabel =
    work.isActive || !work.endDate
      ? "Now"
      : dayjs(work.endDate).format("MMM YYYY");

  return (
    <div className="space-y-8">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to Work Experience
      </Link>

      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 lg:p-10 rounded-2xl text-gray-800 dark:text-gray-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Image
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-2 border border-gray-200 dark:border-gray-800 shadow-sm"
            src={work.imageUrl || FALLBACK_LOGO}
            alt={work.name || "Work logo"}
            width={80}
            height={80}
          />
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
              {work.name}
            </h1>
            {work.workStatus?.statusNameEn && (
              <span className="inline-block rounded-full border border-gray-300 dark:border-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                {work.workStatus.statusNameEn}
              </span>
            )}
            {work.position && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {work.position}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-1">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {startLabel ? `${startLabel} - ${endLabel}` : endLabel}
              </span>
              {work.url && (
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                  Visit Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {work.description && (
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {work.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Related Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No related projects yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="group flex items-start gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                {p.imageUrl && (
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-800 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:underline truncate">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

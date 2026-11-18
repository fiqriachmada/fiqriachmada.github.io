"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { fetchProjectDataById } from "@/lib/projectApi";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function ProjectDetailClient() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-project-detail", id],
    queryFn: () => fetchProjectDataById(id),
    enabled: Boolean(id),
  });

  if (isLoading) return <Loading />;

  if (isError || !data?.data) {
    return (
      <div className="space-y-4 p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <p className="font-semibold">Failed to load project detail</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {error?.message || "Project not found"}
        </p>
        <Link
          href="/project"
          className="inline-flex items-center gap-2 text-xs font-semibold underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const project: any = data.data;
  const works: any[] = project.works || [];
  const images: any[] = project.projectImages || [];

  return (
    <div className="space-y-8">
      <Link
        href="/project"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 lg:p-10 rounded-2xl text-gray-800 dark:text-gray-200 shadow-lg space-y-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
          {project.title}
        </h1>
        {project.description && (
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {project.description}
          </p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <Image
                  src={img.imageUrl}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Related Work
          </h2>
        </div>

        {works.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No related work yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {works.map((w) => (
              <Link
                key={w.id}
                href={`/work/${w.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 px-4 py-2 text-sm hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {w.name}
                </span>
                {w.position && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({w.position})
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectsData } from "@/lib/projectApi";
import {
  LayoutGrid,
  BookOpen,
  FolderGit2,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ProjectBook3D } from "./project-book-3d";

const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

function ProjectCard() {
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'book'

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-projects"],
    queryFn: () => fetchProjectsData({ limit: 50 }),
  });

  const projects = data?.data || [];

  const handleOnClick = (id) => {
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
        <p className="font-semibold">Gagal memuat daftar proyek</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {error?.message || "Terjadi kesalahan pada koneksi API CMS"}
        </p>
      </div>
    );
  }

  const selectedProject = selectedId
    ? projects.find((p) => p.id === selectedId)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kumpulan showcase karya rekayasa perangkat lunak dan portofolio aplikasi.
          </p>
        </div>

        {/* View Mode Toggle Switcher */}
        {!selectedId && (
          <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-1 shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                viewMode === "grid"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}>
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewMode("book")}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                viewMode === "book"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Memory Book 3D</span>
            </button>
          </div>
        )}
      </div>

      {/* Main View Mode Area */}
      {selectedProject ? (
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 lg:p-10 rounded-2xl text-gray-800 dark:text-gray-200 shadow-lg space-y-6">
          <div className="relative w-full aspect-video max-h-[500px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={selectedProject.image || selectedProject.bannerUrl || FALLBACK_IMAGE}
              alt={selectedProject.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <FolderGit2 className="w-4 h-4" />
              <span>Case Study Proyek</span>
              {selectedProject.updatedAt && (
                <span className="text-gray-400 font-normal">
                  • Diperbarui {dayjs(selectedProject.updatedAt).format("MMM YYYY")}
                </span>
              )}
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {selectedProject.title}
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {selectedProject.description || "Tidak ada deskripsi rinci untuk proyek ini."}
            </p>
          </div>

          {/* Project Gallery if more than 1 image */}
          {selectedProject.projectImages && selectedProject.projectImages.length > 1 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Galeri Tangkapan Layar</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedProject.projectImages.map((img) => (
                  <a
                    key={img.id}
                    href={img.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group">
                    <img
                      src={img.imageUrl}
                      alt="Project gallery"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleBack}
              className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
              ← Kembali ke Daftar Proyek
            </button>
          </div>
        </div>
      ) : viewMode === "book" ? (
        <ProjectBook3D projects={projects} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOnClick(project.id)}
              className={clsx(
                "group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
              )}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-center">
                <img
                  src={project.image || project.bannerUrl || FALLBACK_IMAGE}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Showcase Proyek</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {project.description || "Lihat detail proyek..."}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {project.createdAt
                      ? dayjs(project.createdAt).format("MMM YYYY")
                      : "Portfolio"}
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

export default ProjectCard;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import clsx from "clsx";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectsData, fetchProjectById } from "@/lib/projectApi";
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  FolderGit2,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ProjectBook3D } from "./project-book-3d";
import { ProjectDetailBook3D } from "./project-detail-book-3d";
import { PaperMonoFlipbook } from "./paper-mono-flipbook";
import { useProjectViewStore } from "@/store/project-store";

const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

type GalleryViewMode = "grid" | "mono" | "book";

function ProjectCard() {
  const [galleryMode, setGalleryMode] = useState<GalleryViewMode>("grid");
  const {
    selectedProjectId: selectedId,
    setSelectedProjectId: setSelectedId,
    viewMode,
    setViewMode,
  } = useProjectViewStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-projects"],
    queryFn: () => fetchProjectsData({ limit: 50 }),
  });

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useQuery({
    queryKey: ["client-project", selectedId],
    queryFn: () => fetchProjectById(selectedId!),
    enabled: !!selectedId,
    refetchOnMount: "always",
  });

  const projects = data?.data || [];

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
        <p className="font-semibold">Gagal memuat daftar proyek</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {error?.message || "Terjadi kesalahan pada koneksi API CMS"}
        </p>
      </div>
    );
  }

  const selectedProject = detailData?.data;

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
      {selectedId ? (
        isDetailLoading ? (
          <Loading />
        ) : isDetailError || !selectedProject ? (
          <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 space-y-4">
            <div>
              <p className="font-semibold">Gagal memuat detail proyek</p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {detailError?.message || "Terjadi kesalahan pada koneksi API CMS"}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
              ← Kembali ke Daftar Proyek
            </button>
          </div>
        ) : (
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

            {/* Project Gallery Section dengan Filter Mode di Bawah */}
            {selectedProject.projectImages && selectedProject.projectImages.length > 0 && (
              <section className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                      <span>Galeri & Dokumentasi Karya</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Pilih gaya tampilan galeri dokumentasi di bawah ini
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 p-1 backdrop-blur-xs self-start sm:self-auto shadow-xs gap-1">
                    <button
                      onClick={() => setGalleryMode("grid")}
                      className={clsx(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                        galleryMode === "grid"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      )}>
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Grid Gallery</span>
                    </button>

                    <button
                      onClick={() => setGalleryMode("mono")}
                      className={clsx(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                        galleryMode === "mono"
                          ? "bg-amber-500 text-black shadow-xs font-bold"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      )}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Paper Mono 3D</span>
                    </button>

                    <button
                      onClick={() => setGalleryMode("book")}
                      className={clsx(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                        galleryMode === "book"
                          ? "bg-indigo-600 text-white shadow-xs font-bold"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      )}>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Memory Book 3D</span>
                    </button>
                  </div>
                </div>

                {galleryMode === "mono" ? (
                  <PaperMonoFlipbook
                    images={selectedProject.projectImages}
                    projectTitle={selectedProject.title}
                  />
                ) : galleryMode === "book" ? (
                  <ProjectDetailBook3D project={selectedProject} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProject.projectImages.map((img, idx) => (
                      <Link
                        key={img.id || idx}
                        href={img.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          "group relative flex flex-col gap-2 rounded-xl border p-2 overflow-hidden shadow-sm hover:shadow-md transition-all block",
                          img.isBanner
                            ? "border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/20"
                            : "border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-950/40"
                        )}>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                          <Image
                            src={img.imageUrl || FALLBACK_IMAGE}
                            alt={`${selectedProject.title} screenshot ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          {img.isBanner && (
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[10px] shadow-sm">
                                ★ Banner Utama
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="pt-2">
              <button
                onClick={handleBack}
                className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
                ← Kembali ke Daftar Proyek
              </button>
            </div>
          </div>
        )
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

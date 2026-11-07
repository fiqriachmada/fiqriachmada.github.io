"use client";

import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import clsx from "clsx";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogsData } from "@/lib/blogApi";
import { BookOpen, Calendar, ArrowRight, User } from "lucide-react";
import { BlogContentRenderer, extractBlogPlainText } from "./blogContentRenderer";

const FALLBACK_COVER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";

export default function BlogCard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client-blogs"],
    queryFn: () => fetchBlogsData({ limit: 30 }),
  });

  const blogs = data?.data || [];

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
        <p className="font-semibold">Gagal memuat artikel blog</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          {error?.message || "Terjadi kesalahan koneksi API CMS"}
        </p>
      </div>
    );
  }

  const selectedBlog = selectedId
    ? blogs.find((b) => b.id === selectedId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Blog & Writing
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tulisan, artikel teknis, catatan arsitektur, dan pemikiran seputar rekayasa teknologi.
        </p>
      </div>

      {selectedBlog ? (
        <article className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 lg:p-10 rounded-2xl text-gray-800 dark:text-gray-200 shadow-lg space-y-6">
          {selectedBlog.coverImage && (
            <div className="relative w-full aspect-video max-h-[460px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              <Image
                src={selectedBlog.coverImage}
                alt={selectedBlog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="w-full h-full object-cover rounded-xl"
                unoptimized
              />
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
              {selectedBlog.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {dayjs(selectedBlog.publishedAt).format("DD MMMM YYYY")}
                </span>
              )}
              {selectedBlog.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName || ""}
                </span>
              )}
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {selectedBlog.title}
            </h2>

            {selectedBlog.excerpt && (
              <p className="mt-3 text-base italic text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-4 py-1">
                {selectedBlog.excerpt}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <BlogContentRenderer content={selectedBlog.content ?? ""} />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleBack}
              className="bg-black text-white dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 transition shadow-sm">
              ← Kembali ke Daftar Artikel
            </button>
          </div>
        </article>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">Belum ada artikel publik</p>
          <p className="text-xs mt-1">Artikel blog yang di-publish dari CMS akan otomatis tampil di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => handleOnClick(blog.id)}
              className={clsx(
                "group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              )}>
              <div>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center">
                  <Image
                    src={blog.coverImage || FALLBACK_COVER}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {blog.publishedAt
                      ? dayjs(blog.publishedAt).format("DD MMM YYYY")
                      : "Terbaru"}
                  </span>
                </div>

                <h2 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                  {blog.excerpt || extractBlogPlainText(blog.content, 120) || "Baca artikel selengkapnya..."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span>Artikel Teknis</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Baca <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

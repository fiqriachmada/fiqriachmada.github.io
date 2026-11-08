"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  User as UserIcon,
  AtSign,
  KeyRound,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

export default function UserAvatarPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAvatarData = async (uid: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/client/v1/user/avatar?userId=${encodeURIComponent(uid)}`
      );
      const json = await res.json();
      if (json.status === 403 || json.error === "ACCOUNT_BLOCKED") {
        logout();
        router.replace("/login?error=blocked");
        return;
      }
      if (json.status === 200 && json.data) {
        const fetchedUrl = json.data.avatarUrl || null;
        setAvatarUrl(fetchedUrl);
        if (user && fetchedUrl !== (user.image || null)) {
          setUser({ ...user, image: fetchedUrl || "" });
        }
      }
    } catch {
      setAvatarUrl(user?.image || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login?callbackUrl=/settings/avatar");
      return;
    }
    if (user.expiresAt && new Date(user.expiresAt).getTime() <= Date.now()) {
      logout();
      router.replace("/login?callbackUrl=/settings/avatar");
      return;
    }
    setAvatarUrl(user.image || null);
    if (user.id) {
      fetchAvatarData(user.id);
    } else {
      setLoading(false);
    }
  }, [mounted, user?.id]);

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xs font-semibold text-gray-500 animate-pulse">
          Memeriksa sesi autentikasi...
        </div>
      </div>
    );
  }

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    user.username?.[0]?.toUpperCase() ||
    "U";

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Ukuran gambar maksimal 2 MB.",
      });
      return;
    }

    setMessage(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user.id) return;
    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("image", selectedFile);

      const res = await fetch(`${API_BASE}/client/v1/user/avatar`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (res.ok && json.data) {
        const newUrl = json.data.avatarUrl || null;
        setAvatarUrl(newUrl);
        setUser({ ...user, image: newUrl || "" });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setMessage({
          type: "success",
          text: json.message || "Avatar berhasil diperbarui!",
        });
      } else {
        setMessage({
          type: "error",
          text: json.message || json.error || "Gagal mengunggah avatar.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Gagal terhubung ke server CMS.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user.id) return;
    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${API_BASE}/client/v1/user/avatar?userId=${encodeURIComponent(user.id)}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (res.ok) {
        setAvatarUrl(null);
        setUser({ ...user, image: "" });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setMessage({
          type: "success",
          text: json.message || "Avatar berhasil dihapus!",
        });
      } else {
        setMessage({
          type: "error",
          text: json.message || json.error || "Gagal menghapus avatar.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Gagal terhubung ke server CMS.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const currentAvatar = previewUrl || avatarUrl;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Change Avatar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perbarui atau hapus foto profil akun Anda.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-900 p-1 w-fit">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/settings/avatar"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 text-xs font-bold shadow-xs transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Avatar</span>
          </Link>
          <Link
            href="/settings/username"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
          >
            <AtSign className="w-3.5 h-3.5" />
            <span>Username</span>
          </Link>
          <Link
            href="/settings/password"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password</span>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-500" />
            Foto Profil (Avatar)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Unggah foto profil Anda dengan format JPG, PNG, WEBP, atau GIF (maksimal 2 MB).
          </p>
        </div>

        <div className="p-6 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative group">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={user.username || user.name || "User Avatar"}
                  className="h-28 w-28 rounded-full border-2 border-blue-500/30 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-800 bg-blue-500/10 text-3xl font-bold text-blue-600 dark:text-blue-400 shadow-sm">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors hover:bg-blue-600 hover:text-white cursor-pointer"
                aria-label="Change avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleSelectFile}
              />

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || uploading || deleting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pilih Foto</span>
                </button>

                {selectedFile && (
                  <>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading || deleting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? "Mengunggah..." : "Simpan Avatar"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={uploading || deleting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
                    >
                      <span>Batal</span>
                    </button>
                  </>
                )}

                {avatarUrl && !selectedFile && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || uploading || deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{deleting ? "Menghapus..." : "Hapus Avatar"}</span>
                  </button>
                )}
              </div>

              {selectedFile ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  File dipilih:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedFile.name}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rekomendasi rasio 1:1 (persegi) agar tampil optimal pada lingkaran profil.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

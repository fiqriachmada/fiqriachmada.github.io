"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  User as UserIcon,
  AtSign,
  KeyRound,
  Camera,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

export default function UserPasswordPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPasswordStatus = async (uid: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/client/v1/user/password?userId=${encodeURIComponent(uid)}`
      );
      const json = await res.json();
      if (json.status === 200 && json.data) {
        setHasPassword(Boolean(json.data.hasPassword));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login?callbackUrl=/settings/password");
      return;
    }
    if (user.expiresAt && new Date(user.expiresAt).getTime() <= Date.now()) {
      logout();
      router.replace("/login?callbackUrl=/settings/password");
      return;
    }
    if (user.id) {
      fetchPasswordStatus(user.id);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (hasPassword && !currentPassword.trim()) {
      setMessage({
        type: "error",
        text: "Password lama wajib diisi untuk verifikasi.",
      });
      return;
    }

    if (newPassword.trim().length < 6) {
      setMessage({
        type: "error",
        text: "Password baru minimal harus 6 karakter.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Konfirmasi password baru tidak cocok.",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/client/v1/user/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setHasPassword(true);
        if (user) {
          setUser({ ...user, hasPassword: true });
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage({
          type: "success",
          text: json.message || "Password berhasil disimpan!",
        });
      } else {
        setMessage({
          type: "error",
          text: json.message || "Gagal memperbarui password.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Gagal terhubung ke server CMS.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Atur atau perbarui password keamanan akun Anda.
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
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 text-xs font-bold shadow-xs transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password</span>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-500" />
              Keamanan & Password
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {loading
                ? "Memeriksa status password..."
                : hasPassword
                  ? "Masukkan password lama Anda untuk verifikasi sebelum mengganti password baru."
                  : "Akun Anda belum memiliki password. Anda dapat langsung mengatur password baru."}
            </p>
          </div>
          {!loading && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                hasPassword
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              }`}
            >
              {hasPassword ? "Password Aktif" : "Belum Diatur"}
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {!loading && !hasPassword && (
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Password Anda masih kosong (login via Google). Silakan langsung isi password baru di bawah ini.
              </span>
            </div>
          )}

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

          {hasPassword && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading || saving}
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan password lama Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading || saving}
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || saving}
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || saving || !newPassword.trim() || !confirmPassword.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? "Saving..."
                  : hasPassword
                    ? "Update Password"
                    : "Set Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


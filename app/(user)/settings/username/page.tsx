"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  User as UserIcon,
  AtSign,
  KeyRound,
  Clock,
  History,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

interface UsernameHistoryItem {
  id: string;
  username: string;
  isCurrent: boolean;
  createdAt: string;
}

interface UsernameState {
  currentUsername: string;
  lastChangedAt: string | null;
  intervalCode: string;
  cooldownDays: number;
  canChange: boolean;
  nextAllowedDate: string | null;
  daysRemaining: number;
  reason: string | null;
  history: UsernameHistoryItem[];
}

function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function UserUsernamePage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [data, setData] = useState<UsernameState | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUsernameData = async (uid: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/client/v1/user/username?userId=${encodeURIComponent(uid)}`
      );
      const json = await res.json();
      if (json.status === 200 && json.data) {
        setData(json.data);
        setNewUsername(json.data.currentUsername || user?.username || "");
        if (user && json.data.currentUsername && json.data.currentUsername !== user.username) {
          setUser({ ...user, username: json.data.currentUsername });
        }
      }
    } catch {
      setMessage({
        type: "error",
        text: "Gagal memuat data riwayat username dari server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login?callbackUrl=/settings/username");
      return;
    }
    if (user.expiresAt && new Date(user.expiresAt).getTime() <= Date.now()) {
      logout();
      router.replace("/login?callbackUrl=/settings/username");
      return;
    }
    if (user.id) {
      fetchUsernameData(user.id);
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
    if (!newUsername.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/client/v1/user/username`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: newUsername.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setUser({
          ...user,
          username: json.data.username,
        });
        setMessage({
          type: "success",
          text: json.message || "Username berhasil diperbarui!",
        });
        await fetchUsernameData(user.id);
      } else {
        setMessage({
          type: "error",
          text: json.message || "Gagal memperbarui username.",
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

  const canChange = data ? data.canChange : true;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Change Username
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola username unik Anda sesuai interval yang diatur sistem.
          </p>
        </div>

        <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-900 p-1 w-fit">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/settings/username"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 text-xs font-bold shadow-xs transition-all"
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
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AtSign className="w-4 h-4 text-blue-500" />
              Username Configuration
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aturan sistem: pergantian username diizinkan setiap{" "}
              {data?.cooldownDays || 30} hari sekali.
            </p>
          </div>
          {!loading && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                canChange
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {canChange ? "Dapat Diubah" : `Tunggu ${data?.daysRemaining} Hari`}
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {!loading && !canChange && data?.reason && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Masa Cooldown Aktif</p>
                <p>{data.reason}</p>
              </div>
            </div>
          )}

          {!loading && canChange && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Anda memenuhi syarat untuk mengganti username saat ini.</span>
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
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Username Baru
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loading || !canChange || saving}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="username"
            />
            {data?.lastChangedAt && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pt-0.5">
                <Clock className="w-3 h-3" />
                Terakhir tercatat: {formatDateTime(data.lastChangedAt)}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={
                loading ||
                !canChange ||
                saving ||
                !newUsername.trim() ||
                newUsername.trim().toLowerCase() ===
                  (data?.currentUsername || "").toLowerCase()
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Username"}</span>
            </button>
          </div>
        </form>
      </div>

      {data?.history && data.history.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-6 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-500" />
            Riwayat Username
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
            {data.history.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    @{item.username}
                  </span>
                  {item.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Aktif
                    </span>
                  )}
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatDateTime(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


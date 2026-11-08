"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  Shield,
  Mail,
  Save,
  LogOut,
  CheckCircle2,
  User as UserIcon,
  AtSign,
  KeyRound,
  Camera,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

export default function UserSettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side Route Guard
  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login?callbackUrl=/settings");
      return;
    }
    if (user.expiresAt && new Date(user.expiresAt).getTime() <= Date.now()) {
      logout();
      router.replace("/login?callbackUrl=/settings");
      return;
    }

    setFirstName(user.firstName || user.name?.split(" ")[0] || "");
    setLastName(user.lastName || user.name?.split(" ").slice(1).join(" ") || "");
    setUsername(user.username || user.email?.split("@")[0] || "");

    // Sinkronisasi profil terbaru dari CMS Client API
    if (user.id || user.email) {
      const query = user.id
        ? `id=${encodeURIComponent(user.id)}`
        : `email=${encodeURIComponent(user.email)}`;
      fetch(`${API_BASE}/client/v1/user/settings?${query}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 403 || json.error === "ACCOUNT_BLOCKED") {
            logout();
            router.replace("/login?error=blocked");
            return;
          }
          if (json.status === 200 && json.data) {
            const d = json.data;
            setFirstName(d.firstName || "");
            setLastName(d.lastName || "");
            setUsername(d.username || "");
            const fullName =
              [d.firstName, d.lastName].filter(Boolean).join(" ") ||
              d.username ||
              user.name;
            const sessionDays = Number(d.sessionDays) || user.sessionDays || 30;
            const loginTime = user.loginAt ? new Date(user.loginAt).getTime() : Date.now();
            const computedExpiresAt = new Date(
              loginTime + sessionDays * 24 * 60 * 60 * 1000
            );
            if (computedExpiresAt.getTime() <= Date.now()) {
              logout();
              router.replace("/login?callbackUrl=/settings");
              return;
            }
            setUser({
              ...user,
              id: d.id,
              name: fullName,
              firstName: d.firstName,
              lastName: d.lastName,
              username: d.username,
              image: d.image || user.image,
              role: d.role,
              roleName: d.roleName,
              userType: d.roleName || d.role,
              loginType: d.loginType,
              loginTypeName: d.loginTypeName,
              hasPassword: Boolean(d.hasPassword),
              sessionDays,
              loginAt: user.loginAt || new Date(loginTime).toISOString(),
              expiresAt: computedExpiresAt.toISOString(),
            });
          }
        })
        .catch(() => {});
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
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/client/v1/user/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          firstName,
          lastName,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const d = json.data;
        const fullName =
          [d.firstName, d.lastName].filter(Boolean).join(" ") ||
          d.username ||
          user.name;
        setUser({
          ...user,
          name: fullName,
          firstName: d.firstName,
          lastName: d.lastName,
          username: d.username || username,
        });
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      } else {
        setMessage({
          type: "error",
          text: json.message || "Gagal memperbarui profil.",
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

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || user.name || "User";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola informasi profil dan preferensi akun Anda.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Header Profile */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="w-16 h-16 rounded-full border-2 border-blue-500/30 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-lg">
                <UserIcon className="w-7 h-7" />
              </div>
            )}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {fullName}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email} {username ? `• @${username}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Shield className="w-3 h-3" />
                  {user.roleName || user.userType || "Regular"}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Mail className="w-3 h-3" />
                  {user.loginTypeName || user.loginType || "Google"}
                </span>
                {user.loginType !== "credentials" && user.hasPassword && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <KeyRound className="w-3 h-3" />
                    Password
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login?callbackUrl=%2Fsettings");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                Username
              </label>
              <Link
                href="/settings/username"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ubah di tab Username →
              </Link>
            </div>
            <input
              type="text"
              value={username}
              disabled
              readOnly
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-sm font-mono text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              Email Address (Verified)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              readOnly
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

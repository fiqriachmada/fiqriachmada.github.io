"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";
import { ShieldCheck, ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { SiGithub } from "react-icons/si";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "1008124563600-bei37h8ulgompijbguu1gc8a4rbh0prn.apps.googleusercontent.com";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

function LoginForm() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/settings";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "blocked"
      ? "Akun Anda telah dinonaktifkan / diblokir oleh Administrator."
      : null
  );

  useEffect(() => {
    if (user) {
      router.replace(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const applyUserSession = (u: any) => {
    const fullName =
      u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "User";

    const sessionDays = Number(u.sessionDays) || 30;
    const loginAt = new Date().toISOString();
    const expiresAt =
      u.expiresAt ||
      new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString();

    setUser({
      id: u.id,
      name: fullName,
      firstName: u.firstName || null,
      lastName: u.lastName || null,
      username: u.username || null,
      email: u.email,
      image: u.image || null,
      role: u.role || "regular_user",
      roleName: u.roleName || "Regular",
      userType: u.roleName || u.role || "Regular",
      loginType: u.loginType || "google",
      loginTypeName: u.loginTypeName || u.loginType || "Google",
      hasPassword: Boolean(u.hasPassword),
      loginAt,
      expiresAt,
      sessionDays,
    });
    router.replace(callbackUrl);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/client/v1/auth/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const json = await res.json();
      const u = json.data || json.user;

      if (res.ok && u) {
        applyUserSession(u);
      } else {
        setError(json.message || "Email/Username atau password tidak sesuai.");
      }
    } catch {
      setError("Gagal terhubung ke server autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/client/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const json = await res.json();
      const u = json.data || json.user;

      if (res.ok && u) {
        applyUserSession(u);
      } else {
        setError(json.message || "Gagal login menggunakan Google.");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("Gagal terhubung ke server autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-2xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Sign in to Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Masuk dengan akun Email/Username & Password atau OAuth.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email atau Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              placeholder="email@domain.com atau username"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Masukkan password Anda"
                className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !identifier.trim() || !password}
            className="w-full h-10 px-4 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Signing in..." : "Sign in with Password"}</span>
          </button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-400 font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="w-full flex justify-center">
              {loading ? (
                <div className="py-2.5 text-xs font-semibold text-gray-500 animate-pulse">
                  Memverifikasi kredensial...
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Pop-up login Google ditutup atau gagal.")}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="continue_with"
                  width="320"
                />
              )}
            </div>
          </GoogleOAuthProvider>

          <button
            type="button"
            disabled
            className="w-full max-w-[320px] flex items-center justify-center gap-2.5 h-10 px-4 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-500 opacity-60 cursor-not-allowed"
          >
            <SiGithub className="h-4 w-4" />
            <span>Continue with GitHub (Coming Soon)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[65vh]" />}>
      <LoginForm />
    </Suspense>
  );
}

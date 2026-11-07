"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";
import { ShieldCheck, ArrowLeft } from "lucide-react";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace(callbackUrl);
    }
  }, [user, router, callbackUrl]);

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
        const fullName =
          u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "User";

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
        });
        router.replace(callbackUrl);
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
            Pilih metode autentikasi untuk mengakses profil dan pengaturan akun Anda.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <div className="space-y-3 flex flex-col items-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="w-full flex justify-center">
              {loading ? (
                <div className="py-2.5 text-xs font-semibold text-gray-500 animate-pulse">
                  Memverifikasi kredensial Google...
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

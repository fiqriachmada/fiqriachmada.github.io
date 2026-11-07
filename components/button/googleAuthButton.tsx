"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, User as UserIcon } from "lucide-react";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "1008124563600-bei37h8ulgompijbguu1gc8a4rbh0prn.apps.googleusercontent.com";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";

export default function GoogleAuthButton() {
  const { user, setUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/client/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        console.error("Auth failed:", data);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          aria-label="User menu"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full border border-gray-400"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-full bottom-0 mr-3 w-56 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-3 z-50">
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
              {user.email}
            </p>
            <div className="inline-block px-2 py-0.5 mb-3 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
              {user.userType || "regular_user"}
            </div>
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex items-center">
        {loading ? (
          <div className="text-xs text-gray-500">Signing in...</div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.error("Google Login Failed")}
            type="icon"
            shape="circle"
            size="medium"
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}


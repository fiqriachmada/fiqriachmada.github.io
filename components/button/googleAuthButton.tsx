"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { LogIn, LogOut, User as UserIcon, Settings, Shield } from "lucide-react";

export default function GoogleAuthButton() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-700 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition-all cursor-pointer"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign in</span>
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full ring-2 ring-blue-500/40 hover:ring-blue-500 transition cursor-pointer"
        aria-label="User menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 bottom-full mb-2 lg:bottom-auto lg:top-full lg:mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-3 z-50 space-y-2">
          <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
            <p className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Shield className="w-2.5 h-2.5" />
              {user.roleName || user.userType || "Regular"}
            </span>
          </div>

          <Link
            href="/settings"
            onClick={() => setDropdownOpen(false)}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

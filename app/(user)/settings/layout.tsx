"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  User as UserIcon,
  Camera,
  AtSign,
  KeyRound,
  Search,
  X,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";

interface SettingsNavItem {
  href: string;
  label: string;
  description: string;
  keywords: string;
  icon: React.ElementType;
}

const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    href: "/settings",
    label: "Profile",
    description: "Informasi & nama profil",
    keywords: "profile profil nama first name last name email",
    icon: UserIcon,
  },
  {
    href: "/settings/avatar",
    label: "Avatar",
    description: "Foto profil akun",
    keywords: "avatar foto photo gambar image profile picture",
    icon: Camera,
  },
  {
    href: "/settings/username",
    label: "Username",
    description: "Kelola & riwayat username",
    keywords: "username handle id riwayat history cooldown",
    icon: AtSign,
  },
  {
    href: "/settings/password",
    label: "Password",
    description: "Keamanan & ganti password",
    keywords: "password kata sandi keamanan security",
    icon: KeyRound,
  },
];

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isItemActive = (href: string) => {
    if (href === "/settings") {
      return pathname === "/settings";
    }
    return pathname.startsWith(href);
  };

  const currentItem =
    SETTINGS_NAV_ITEMS.find((item) => isItemActive(item.href)) ||
    SETTINGS_NAV_ITEMS[0];
  const CurrentIcon = currentItem.icon;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SETTINGS_NAV_ITEMS;
    return SETTINGS_NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      router.push(filteredItems[0].href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      {/* Mobile Dropdown + Autocomplete Search */}
      <div ref={mobileMenuRef} className="block md:hidden mb-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 text-left font-bold text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <CurrentIcon className="w-4 h-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                  Menu Pengaturan
                </span>
                <span>{currentItem.label}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ml-1 ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{mobileMenuOpen ? "Tutup" : "Pilih Menu"}</span>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Cari pengaturan..."
                  className="w-full h-8 pl-8 pr-7 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          isActive
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span
                            className={`text-[11px] font-normal ${
                              isActive
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-3 py-2 text-xs text-gray-500">
                    Menu tidak ditemukan.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Desktop Left Sidebar + Autocomplete Search */}
        <aside className="hidden md:flex w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-10 flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xl">
          <div className="space-y-3.5">
            <div className="border-b border-gray-100 dark:border-gray-800 px-1 pb-3">
              <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Kelola profil & keamanan akun
              </p>
            </div>

            {/* Autocomplete Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Cari menu (Enter)..."
                className="w-full h-8 pl-8 pr-7 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <nav className="space-y-1" aria-label="Settings navigation">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isActive
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs font-bold"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-white dark:text-gray-900"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{item.label}</span>
                        <span
                          className={`text-[11px] font-normal truncate ${
                            isActive
                              ? "text-gray-300 dark:text-gray-600"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-xs text-gray-500">
                  Tidak ada menu yang cocok dengan &ldquo;{query}&rdquo;
                </div>
              )}
            </nav>
          </div>

          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-3">
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace(
                  `/login?callbackUrl=${encodeURIComponent(
                    pathname || "/settings"
                  )}`
                );
              }}
              className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Section */}
        <section className="flex-1 min-w-0 w-full">{children}</section>
      </div>
    </div>
  );
}


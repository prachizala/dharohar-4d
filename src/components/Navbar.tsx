"use client";

import React from "react";
import Link from "next/link";
import { Landmark, Upload, Search, ShieldCheck, Box } from "lucide-react";
import { useT } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";

export const Navbar: React.FC = () => {
  const { t } = useT();

  return (
    <>
      {/* Skip to Content link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-zinc-100 hover:text-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-md">
              <Landmark className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                {t("appName")}
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:block">
                Digital Heritage Archive & 3D Twins
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>{t("archive")}</span>
            </Link>

            <Link
              href="/monument/1"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Box className="w-4 h-4 text-amber-400" />
              <span>{t("model3d")}</span>
            </Link>

            <Link
              href="/upload"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Upload className="w-4 h-4" />
              <span>{t("upload")}</span>
            </Link>

            <Link
              href="/review"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Admin Review Queue"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">{t("adminReview")}</span>
            </Link>

            {/* Language Switcher */}
            <LangSwitch />
          </nav>
        </div>
      </header>
    </>
  );
};


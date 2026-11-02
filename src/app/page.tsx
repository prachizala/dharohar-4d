"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download, Landmark, FileText, Sparkles, AlertCircle, RefreshCw, Zap, Compass, History } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Filters } from "@/components/Filters";
import { ResultCard, SearchItem } from "@/components/ResultCard";
import { fetchApi, getIsOfflineMode, subscribeOfflineMode } from "@/lib/api";
import { PageSkeleton, ArchiveGridSkeleton } from "@/components/SkeletonLoader";
import { IndiaGeoExplorer } from "@/components/IndiaGeoExplorer";
import { ThenVsNowSlider } from "@/components/ThenVsNowSlider";

function SearchContent() {
  const { t, lang } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") || "";
  const monParam = searchParams.get("monument_id") || "";
  const langParam = searchParams.get("language") || "";
  const statusParam = searchParams.get("verify_status") || "";
  const licParam = searchParams.get("license") || "";
  const has3dParam = searchParams.get("has_3d") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [inputVal, setInputVal] = useState(qParam);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<any>({});
  const [monuments, setMonuments] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const viewParam = (searchParams.get("view") as "archive" | "map" | "diff") || "archive";
  const [activeView, setActiveView] = useState<"archive" | "map" | "diff">(viewParam);

  // Sync active view whenever URL parameters change
  useEffect(() => {
    const v = (searchParams.get("view") as "archive" | "map" | "diff") || "archive";
    setActiveView(v);
  }, [searchParams]);

  const handleSwitchView = (v: "archive" | "map" | "diff") => {
    setActiveView(v);
    const params = new URLSearchParams(searchParams.toString());
    if (v === "archive") {
      params.delete("view");
    } else {
      params.set("view", v);
    }
    router.push(`/?${params.toString()}`);
  };

  // Subscribe to offline / fallback mode state
  useEffect(() => {
    const unsub = subscribeOfflineMode((offline) => {
      setIsOffline(offline);
    });
    return unsub;
  }, []);

  // Fetch monuments list for filter dropdown
  useEffect(() => {
    fetchApi("/api/v1/monuments")
      .then((res) => setMonuments(res.monuments || []))
      .catch((err) => console.error("Error fetching monuments:", err));
  }, []);

  // Sync input value with URL param
  useEffect(() => {
    setInputVal(qParam);
  }, [qParam]);

  // Fetch search results on URL query changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    fetchApi(`/api/v1/search?${params.toString()}`)
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
        setFacets(res.facets || {});
      })
      .catch((err) => {
        console.error("Search error:", err);
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [searchParams, lang]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (inputVal.trim()) {
      params.set("q", inputVal.trim());
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handleExport = (format: "csv" | "json") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("format", format);
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/export?${params.toString()}`, "_blank");
  };

  const quickPills = [
    { label: "Adalaj Stepwell", query: "Adalaj" },
    { label: "रानी की वाव", query: "रानी की वाव" },
    { label: "Modhera Sun Temple", query: "Modhera" },
    { label: "સીદી સૈયદ જાળી", query: "સીદી સૈયદ" },
    { label: "Solanki Architecture", query: "Solanki" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t("appName")}: <span className="text-amber-400">{t("archive")}</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          {t("tagline")}. Every record authenticated with citation sources and verification badges.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-zinc-400 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("search")}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs sm:text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {t("search")}
            </button>
          </div>
        </form>

        {/* Quick query pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-zinc-500 font-medium">Try:</span>
          {quickPills.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveView("archive");
                setInputVal(p.query);
                const params = new URLSearchParams(searchParams.toString());
                params.set("q", p.query);
                params.set("page", "1");
                router.push(`/?${params.toString()}`);
              }}
              className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-amber-500/60 hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher: Archive, Geo-Explorer, Then vs. Now */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => handleSwitchView("archive")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeView === "archive"
                ? "bg-amber-500 text-black shadow-lg ring-1 ring-amber-400"
                : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Digital Archive ({items.length || total || 7})</span>
          </button>

          <button
            onClick={() => handleSwitchView("map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeView === "map"
                ? "bg-amber-500 text-black shadow-lg ring-1 ring-amber-400"
                : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>India Geo-Explorer</span>
          </button>

          <button
            onClick={() => handleSwitchView("diff")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeView === "diff"
                ? "bg-amber-500 text-black shadow-lg ring-1 ring-amber-400"
                : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historical Time-Slider (Then vs. Now)</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeView === "map" ? (
        <IndiaGeoExplorer />
      ) : activeView === "diff" ? (
        <ThenVsNowSlider />
      ) : (
        /* Main Content: Filters + Results */
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Filter Sidebar */}
          <Filters monuments={monuments} facets={facets} />

          {/* Right Results Grid */}
          <div className="flex-1 w-full space-y-4">
            {/* Results Summary & Export Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
              <div>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    Searching archive...
                  </span>
                ) : (
                  <span>
                    Showing <strong className="text-zinc-200">{items.length}</strong> of{" "}
                    <strong className="text-zinc-200">{total}</strong> archival resources
                    {qParam && <span> for &ldquo;{qParam}&rdquo;</span>}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport("csv")}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  title="Export filtered records as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("exportCsv")}</span>
                </button>

                <button
                  onClick={() => handleExport("json")}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  title="Export filtered records as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("exportJson")}</span>
                </button>
              </div>
            </div>

            {/* Result Cards Grid */}
            {loading ? (
              <ArchiveGridSkeleton count={4} />
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <ResultCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3">
                <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-semibold text-zinc-200">{t("noResults")}</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  No published archival resources matched your search filters. Try clearing some filters or searching for terms like &ldquo;Adalaj&rdquo;, &ldquo;Vav&rdquo;, or &ldquo;Stepwell&rdquo;.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

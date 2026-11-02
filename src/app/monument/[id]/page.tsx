"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Landmark,
  Box,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  RefreshCw,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchApi, getIsOfflineMode, subscribeOfflineMode } from "@/lib/api";
import { ModelViewer } from "@/components/ModelViewer";
import { SourcePanel, Claim } from "@/components/SourcePanel";
import { ResultCard } from "@/components/ResultCard";

export default function MonumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { t, lang } = useT();

  const [monument, setMonument] = useState<any>(null);
  const [allMonuments, setAllMonuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"3d" | "photos" | "docs" | "claims">("3d");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsub = subscribeOfflineMode((offline) => {
      setIsOffline(offline);
    });
    return unsub;
  }, []);

  useEffect(() => {
    fetchApi("/api/v1/monuments")
      .then((res) => setAllMonuments(res.monuments || []))
      .catch((err) => console.error("Error loading monuments list:", err));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchApi(`/api/v1/monuments/${id}`)
      .then((data) => setMonument(data))
      .catch((err) => console.error("Error loading monument:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="space-y-2">
            <div className="h-4 w-48 bg-zinc-800/70 rounded" />
            <div className="h-8 w-72 bg-gradient-to-r from-zinc-800 via-amber-950/30 to-zinc-800 rounded-lg" />
            <div className="h-4 w-60 bg-zinc-800/50 rounded" />
          </div>
          <div className="h-9 w-40 bg-zinc-800/80 rounded-lg" />
        </div>

        {/* 3D Canvas Skeleton */}
        <div className="h-[420px] w-full rounded-2xl border border-amber-900/30 bg-zinc-950/80 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
          <Box className="w-12 h-12 text-amber-500/30 mb-2 animate-bounce" />
          <span className="text-xs font-mono text-amber-400/80">Loading photogrammetric mesh & architectural shaders...</span>
        </div>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-zinc-100">Monument not found</h2>
        <a href="/" className="inline-block mt-4 text-amber-400 underline text-sm">
          Return to Archive
        </a>
      </div>
    );
  }

  const localizedName =
    lang === "hi" && monument.name_hi
      ? monument.name_hi
      : lang === "gu" && monument.name_gu
      ? monument.name_gu
      : monument.name_en;

  const photos = monument.resources?.photos || [];
  const documents = [
    ...(monument.resources?.pdfs || []),
    ...(monument.resources?.pptxs || []),
    ...(monument.resources?.docxs || []),
    ...(monument.resources?.reports || []),
  ];
  const claims = monument.claims || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Monument Switcher & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{monument.district}, {monument.state}</span>
            {monument.lat && monument.lon && (
              <span>&bull; ({monument.lat.toFixed(4)}°N, {monument.lon.toFixed(4)}°E)</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <span>{localizedName}</span>
            {localizedName !== monument.name_en && (
              <span className="text-sm font-normal text-zinc-400">({monument.name_en})</span>
            )}
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {monument.period || "Historical Period"}
            </span>
            <span>&bull;</span>
            <span>{photos.length} Photos</span>
            <span>&bull;</span>
            <span>{documents.length} Archival Documents</span>
            <span>&bull;</span>
            <span>{claims.length} Verified Claims</span>
          </div>
        </div>

        {/* Quick Monument Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Monument:</span>
          <select
            value={id}
            onChange={(e) => router.push(`/monument/${e.target.value}`)}
            className="text-xs p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {allMonuments.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name_en} ({m.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs: 3D Model, Photos, Documents, Claims */}
      <div className="flex border-b border-zinc-800 text-xs sm:text-sm font-semibold gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("3d")}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-t ${
            activeTab === "3d"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Box className="w-4 h-4" />
          <span>{t("model3d")}</span>
          {monument.model3d && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Live
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-t ${
            activeTab === "photos"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-t ${
            activeTab === "docs"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents & Reports ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("claims")}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-t ${
            activeTab === "claims"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticated Claims ({claims.length})</span>
        </button>
      </div>

      {/* Tab 1: 3D Model with ModelViewer */}
      {activeTab === "3d" && (
        <div className="space-y-6">
          {monument.model3d ? (
            <ModelViewer
              src={monument.model3d.file_path || "/models/adalaj.glb"}
              label={monument.model3d.label}
              method={monument.model3d.method}
              photoCount={monument.model3d.photo_count}
              quality={monument.model3d.quality}
              monumentName={monument.name_en}
            />
          ) : (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
              <Box className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-zinc-200">No 3D Model Registered Yet</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Upload 40 to 80 multi-view photographs of {monument.name_en} to queue a 3D photogrammetry reconstruction run.
              </p>
              <a
                href="/upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs"
              >
                Upload Photos for 3D Modeling
              </a>
            </div>
          )}

          {/* Photos Source Carousel/Gallery */}
          {photos.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-200">
                Crowdsourced Photographs Used for Reconstruction ({photos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((p: any) => (
                  <a
                    key={p.id}
                    href={`/resource/${p.id}`}
                    className="group block rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video relative hover:border-amber-500/60 transition-colors"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/resources/${p.id}/download`}
                      alt={p.alt_text || p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-[10px] text-zinc-300 font-medium truncate">
                      {p.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Photos Gallery */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p: any) => (
                <ResultCard key={p.id} item={{ ...p, monument: monument.name_en }} />
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-xs text-zinc-500">No photos uploaded for this monument yet.</p>
          )}
        </div>
      )}

      {/* Tab 3: Documents & Reports */}
      {activeTab === "docs" && (
        <div className="space-y-4">
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((d: any) => (
                <ResultCard key={d.id} item={{ ...d, monument: monument.name_en }} />
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-xs text-zinc-500">No documents uploaded for this monument yet.</p>
          )}
        </div>
      )}

      {/* Tab 4: Authenticated Claims */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
            Historical claims recorded for <strong>{monument.name_en}</strong>. Each claim is verified with primary citations and exact textual excerpts.
          </div>
          {claims.length > 0 ? (
            <div className="space-y-3">
              {claims.map((c: Claim) => (
                <SourcePanel key={c.id} claim={c} />
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-xs text-zinc-500">No claims recorded yet for this monument.</p>
          )}
        </div>
      )}
    </div>
  );
}


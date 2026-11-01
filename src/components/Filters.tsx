"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, Check, Box } from "lucide-react";
import { useT } from "@/lib/i18n";

interface FiltersProps {
  monuments?: Array<{ id: number; name_en: string; name_hi?: string; name_gu?: string }>;
  facets?: {
    type?: Record<string, number>;
    language?: Record<string, number>;
    verify_status?: Record<string, number>;
  };
}

export const Filters: React.FC<FiltersProps> = ({ monuments = [], facets = {} }) => {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentMonument = searchParams.get("monument_id") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentStatus = searchParams.get("verify_status") || "";
  const currentLicense = searchParams.get("license") || "";
  const currentHas3d = searchParams.get("has_3d") === "true";

  const updateFilter = (key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    currentType || currentMonument || currentLanguage || currentStatus || currentLicense || currentHas3d
  );

  return (
    <aside className="w-full lg:w-64 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-5 text-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h2 className="font-semibold text-zinc-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          {t("filters")}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 focus:outline-none focus:underline"
          >
            <X className="w-3.5 h-3.5" />
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* 3D Model Quick Filter */}
      <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-200">
          <input
            type="checkbox"
            checked={currentHas3d}
            onChange={(e) => updateFilter("has_3d", e.target.checked ? true : null)}
            className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500"
          />
          <Box className="w-4 h-4 text-amber-400" />
          <span>{t("has3d")}</span>
        </label>
      </div>

      {/* Monument Filter */}
      <div className="space-y-1.5">
        <label htmlFor="filter-monument" className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
          {t("monument")}
        </label>
        <select
          id="filter-monument"
          value={currentMonument}
          onChange={(e) => updateFilter("monument_id", e.target.value)}
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">{t("all")}</option>
          {monuments.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Type Filter */}
      <div className="space-y-1.5">
        <label htmlFor="filter-type" className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
          {t("resourceType")}
        </label>
        <select
          id="filter-type"
          value={currentType}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">{t("all")}</option>
          <option value="photo">Photo ({facets.type?.photo || 0})</option>
          <option value="pdf">PDF Document ({facets.type?.pdf || 0})</option>
          <option value="pptx">Presentation PPTX ({facets.type?.pptx || 0})</option>
          <option value="docx">Report DOCX ({facets.type?.docx || 0})</option>
          <option value="report">Text Archive ({facets.type?.report || 0})</option>
        </select>
      </div>

      {/* Language Filter */}
      <div className="space-y-1.5">
        <label htmlFor="filter-lang" className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
          {t("language")}
        </label>
        <select
          id="filter-lang"
          value={currentLanguage}
          onChange={(e) => updateFilter("language", e.target.value)}
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">{t("all")}</option>
          <option value="en">English ({facets.language?.en || 0})</option>
          <option value="hi">हिन्दी / Hindi ({facets.language?.hi || 0})</option>
          <option value="gu">ગુજરાતી / Gujarati ({facets.language?.gu || 0})</option>
        </select>
      </div>

      {/* Verification Status Filter */}
      <div className="space-y-1.5">
        <label htmlFor="filter-status" className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
          {t("verificationStatus")}
        </label>
        <select
          id="filter-status"
          value={currentStatus}
          onChange={(e) => updateFilter("verify_status", e.target.value)}
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">{t("all")}</option>
          <option value="verified">Verified ({facets.verify_status?.verified || 0})</option>
          <option value="sourced">Sourced ({facets.verify_status?.sourced || 0})</option>
          <option value="ai_suggested">AI Suggested ({facets.verify_status?.ai_suggested || 0})</option>
          <option value="disputed">Disputed ({facets.verify_status?.disputed || 0})</option>
        </select>
      </div>

      {/* License Filter */}
      <div className="space-y-1.5">
        <label htmlFor="filter-license" className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
          {t("license")}
        </label>
        <select
          id="filter-license"
          value={currentLicense}
          onChange={(e) => updateFilter("license", e.target.value)}
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">{t("all")}</option>
          <option value="CC0">CC0 Public Domain</option>
          <option value="CC-BY-4.0">CC-BY 4.0</option>
          <option value="CC-BY-SA-4.0">CC-BY-SA 4.0</option>
        </select>
      </div>
    </aside>
  );
};


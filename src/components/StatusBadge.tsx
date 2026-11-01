import React from "react";
import { CheckCircle2, BookOpen, Sparkles, AlertTriangle, HelpCircle, XCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export type VerifyStatusType = "verified" | "sourced" | "ai_suggested" | "disputed" | "conjectural" | "no_source";

interface StatusBadgeProps {
  status: string;
  hasSource?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, hasSource = true }) => {
  const { t } = useT();

  let resolvedStatus = (status || "").toLowerCase().trim();
  if (hasSource === false && (resolvedStatus === "ai_suggested" || !resolvedStatus)) {
    resolvedStatus = "no_source";
  }

  switch (resolvedStatus) {
    case "verified":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-200 border border-emerald-600/50"
          title="Verified by scholarly authority or human reviewer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{t("verified")}</span>
        </span>
      );
    case "sourced":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-200 border border-blue-600/50"
          title="Supported by cited bibliographic source"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
          <span>{t("sourced")}</span>
        </span>
      );
    case "ai_suggested":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950 text-purple-200 border border-purple-600/50"
          title="AI-extracted suggestion; awaiting review"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" />
          <span>{t("aiSuggested")}</span>
        </span>
      );
    case "disputed":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-200 border border-amber-600/50"
          title="Contradicting historical evidence or disputed claim"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span>{t("disputed")}</span>
        </span>
      );
    case "conjectural":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-200 border border-indigo-600/50"
          title="Historical hypothesis or oral tradition"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
          <span>{t("conjectural")}</span>
        </span>
      );
    case "no_source":
    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-700"
          title="No verified citation found in records"
        >
          <XCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
          <span>{t("noSource")}</span>
        </span>
      );
  }
};


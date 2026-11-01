import React from "react";
import { BookOpen, ExternalLink, ShieldCheck, FileText, Quote } from "lucide-react";
import { useT } from "@/lib/i18n";
import { StatusBadge } from "./StatusBadge";

export interface Source {
  id?: number;
  title?: string;
  author?: string;
  year?: string;
  url?: string;
  locator?: string;
  tier?: number;
}

export interface Claim {
  id: number;
  type?: string;
  text: string;
  date_certainty?: string;
  snippet?: string | null;
  status: string;
  reviewer?: string | null;
  reviewed_at?: string | null;
  sources?: Source[];
  source_title?: string;
  source_author?: string;
  source_year?: string;
  source_url?: string;
  source_locator?: string;
  source_tier?: number;
}

interface SourcePanelProps {
  claim: Claim;
  onDispute?: (claimId: number) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ claim, onDispute }) => {
  const { t } = useT();

  // Combine sources from array or flattened columns
  const allSources: Source[] = claim.sources && claim.sources.length > 0 ? claim.sources : [];
  if (allSources.length === 0 && claim.source_title) {
    allSources.push({
      title: claim.source_title,
      author: claim.source_author,
      year: claim.source_year,
      url: claim.source_url,
      locator: claim.source_locator,
      tier: claim.source_tier,
    });
  }

  const hasSources = allSources.length > 0;

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-3">
      {/* Header: Claim text and status */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1 flex-1 min-w-[240px]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
              {claim.type || "Historical Claim"}
            </span>
            {claim.date_certainty && (
              <span className="text-[11px] text-zinc-400 font-mono">
                [{claim.date_certainty}]
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-zinc-100 leading-snug">
            {claim.text}
          </p>
        </div>
        <StatusBadge status={claim.status} hasSource={hasSources} />
      </div>

      {/* Supporting Snippet (Exact substring from source text) */}
      {claim.snippet ? (
        <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2">
          <Quote className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-400 uppercase text-[10px] tracking-wider block mb-0.5">
              Verified Source Excerpt:
            </span>
            <span className="italic font-serif text-amber-100/90 leading-relaxed">
              &ldquo;{claim.snippet}&rdquo;
            </span>
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-zinc-500 italic flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          No textual snippet recorded for this claim.
        </div>
      )}

      {/* Sources list */}
      {hasSources ? (
        <div className="pt-2 border-t border-zinc-800/60 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            {t("source")} & Citations ({allSources.length})
          </span>
          <div className="grid gap-2 sm:grid-cols-1">
            {allSources.map((s, idx) => (
              <div
                key={idx}
                className="text-xs p-2 rounded bg-zinc-950/50 border border-zinc-800/50 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <span className="font-medium text-zinc-200">{s.title || "Archival Source Record"}</span>
                  {s.author && <span className="text-zinc-400"> &bull; {s.author}</span>}
                  {s.year && <span className="text-zinc-500"> ({s.year})</span>}
                  {s.locator && <span className="text-amber-400/90 font-mono text-[11px]"> &bull; {s.locator}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      s.tier === 1
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : s.tier === 2
                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    Tier {s.tier || 3}
                  </span>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-1 text-[11px] text-amber-500/80 bg-amber-950/20 border border-amber-900/30 p-2 rounded flex items-center justify-between">
          <span>{t("noSource")}: Unverified archival claim awaiting primary citations.</span>
        </div>
      )}

      {/* Reviewer signature or dispute option */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
        <div>
          {claim.reviewer && (
            <span className="flex items-center gap-1 text-emerald-400/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              Reviewed by: {claim.reviewer}
            </span>
          )}
        </div>
        {onDispute && claim.status !== "disputed" && (
          <button
            onClick={() => onDispute(claim.id)}
            className="text-amber-400 hover:text-amber-300 underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1"
          >
            Mark Disputed
          </button>
        )}
      </div>
    </div>
  );
};


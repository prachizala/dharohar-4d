"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/navigation";
import {
  Download,
  Quote,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  FileText,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Box,
  Image as ImageIcon
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchApi } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { SourcePanel, Claim } from "@/components/SourcePanel";

export default function ResourceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useT();

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [citationText, setCitationText] = useState("");
  const [copiedCite, setCopiedCite] = useState(false);
  const [showCiteModal, setShowCiteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Claim extraction state
  const [extractingClaims, setExtractingClaims] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchApi(`/api/v1/resources/${id}`)
      .then((data) => setResource(data))
      .catch((err) => console.error("Error loading resource:", err))
      .finally(() => setLoading(false));

    fetchApi(`/api/v1/resources/${id}/cite`)
      .then((res) => setCitationText(res.citation || ""))
      .catch((err) => console.error("Citation error:", err));
  }, [id]);

  const handleCopyCitation = () => {
    if (citationText) {
      navigator.clipboard.writeText(citationText);
      setCopiedCite(true);
      setTimeout(() => setCopiedCite(false), 2000);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim()) return;
    try {
      await fetchApi("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: "resource",
          target_id: parseInt(id, 10),
          message: reportMessage,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
        setReportMessage("");
      }, 2000);
    } catch (err) {
      console.error("Report submit error:", err);
    }
  };

  const handleExtractClaims = async () => {
    setExtractingClaims(true);
    setExtractionResult(null);
    try {
      const res = await fetchApi(`/api/v1/resources/${id}/extract-claims`, {
        method: "POST",
      });
      setExtractionResult(res);
      // Refresh resource details to include new claims
      const updated = await fetchApi(`/api/v1/resources/${id}`);
      setResource(updated);
    } catch (err) {
      console.error("Extract claims error:", err);
    } finally {
      setExtractingClaims(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        <p className="text-zinc-400 text-sm">Retrieving verified archival resource #{id}...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-zinc-100">Resource not found</h2>
        <p className="text-zinc-400 text-sm">The requested archival item could not be found or has been removed.</p>
        <a href="/" className="inline-block mt-4 text-amber-400 underline text-sm">
          Return to Archive
        </a>
      </div>
    );
  }

  const isPhoto = resource.type === "photo";
  const isPdf = resource.type === "pdf";
  const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/resources/${id}/download`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <a href="/" className="hover:text-amber-400">Archive</a>
          <span>/</span>
          {resource.monument_id && (
            <>
              <a href={`/monument/${resource.monument_id}`} className="hover:text-amber-400 text-amber-400/90 font-medium">
                {resource.monument_name_en || `Monument #${resource.monument_id}`}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-200 truncate max-w-[200px]">{resource.title}</span>
        </div>

        {/* Action Buttons: Download, Cite, Report Error */}
        <div className="flex items-center gap-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("download")} Original</span>
          </a>

          <button
            onClick={() => setShowCiteModal(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Quote className="w-3.5 h-3.5 text-blue-400" />
            <span>{t("cite")}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("reportError")}</span>
          </button>
        </div>
      </div>

      {/* Resource Title & Status Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="uppercase text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
            {resource.type}
          </span>
          <StatusBadge status={resource.verify_status} />
          {resource.publish_status === "pending" && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Pending Admin Review
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {resource.title}
        </h1>
        {resource.ai_summary && (
          <p className="text-sm text-zinc-300 italic bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 block not-italic mb-0.5">
              AI Summary:
            </span>
            &ldquo;{resource.ai_summary}&rdquo;
          </p>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {isPhoto ? (
          <div className="p-4 flex flex-col items-center justify-center bg-black/60">
            {/* Real photo or generated placeholder */}
            <img
              src={downloadUrl}
              alt={resource.alt_text || resource.title}
              className="max-h-[500px] w-auto object-contain rounded-lg shadow-lg"
            />
            {resource.alt_text && (
              <p className="text-xs text-zinc-400 mt-2 text-center italic">
                Screen reader description: {resource.alt_text}
              </p>
            )}
          </div>
        ) : isPdf ? (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4 text-red-400" />
                Archival Document: {resource.original_name}
              </span>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src={downloadUrl}
              title={resource.title}
              className="w-full h-[500px] rounded-lg border border-zinc-800 bg-white"
            />
          </div>
        ) : (
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4 text-amber-400" />
                Extracted Document Text ({resource.original_name})
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {resource.text || "No text extracted from this file."}
            </div>
          </div>
        )}
      </div>

      {/* Metadata & Provenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Provenance & Metadata
          </h2>
          <dl className="grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-zinc-500">Creator / Author:</dt>
            <dd className="text-zinc-200 font-medium">{resource.creator || "Anonymous"}</dd>

            <dt className="text-zinc-500">Contributor:</dt>
            <dd className="text-zinc-200">{resource.contributor || "Heritage Contributor"}</dd>

            <dt className="text-zinc-500">License:</dt>
            <dd className="text-amber-400 font-mono">{resource.license || "CC-BY-4.0"}</dd>

            <dt className="text-zinc-500">Language:</dt>
            <dd className="text-zinc-200 uppercase font-mono">{resource.language || "en"}</dd>

            <dt className="text-zinc-500">Archived Date:</dt>
            <dd className="text-zinc-300 font-mono">{resource.created_at ? resource.created_at.slice(0, 10) : "2026"}</dd>
          </dl>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Digital Integrity (SHA-256)
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-zinc-950 font-mono text-[11px] text-zinc-400 break-all border border-zinc-800">
              {resource.sha256 || "N/A"}
            </div>
            {resource.phash && (
              <p className="text-[11px] text-zinc-500">
                Perceptual Hash: <code className="font-mono text-zinc-400">{resource.phash}</code>
              </p>
            )}
            {resource.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resource.tags.split(",").map((t: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-zinc-800 text-[11px] text-zinc-300">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Authenticity Section: Claims & Citations */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Authenticated Claims & Sources
            </h2>
            <p className="text-xs text-zinc-400">
              Every historical claim must carry a supporting primary text snippet and verification badge.
            </p>
          </div>

          {resource.text && (
            <button
              onClick={handleExtractClaims}
              disabled={extractingClaims}
              className="px-3.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {extractingClaims ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying snippets with LLM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Extract Claims from Document</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Feedback on claims extraction anti-hallucination filter */}
        {extractionResult && (
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 space-y-1">
            <p className="font-semibold text-purple-100">
              Anti-Hallucination Verification Finished:
            </p>
            <p>
              &bull; <strong>{extractionResult.saved_count || 0}</strong> claims passed snippet exact matching and were saved as AI suggestions.
            </p>
            {extractionResult.rejected_claims > 0 && (
              <p className="text-amber-300">
                &bull; <strong>{extractionResult.rejected_claims}</strong> ungrounded/hallucinated claims were rejected because their supporting snippets could not be verified in the source text!
              </p>
            )}
          </div>
        )}

        {/* Claims List */}
        {resource.claims && resource.claims.length > 0 ? (
          <div className="space-y-3">
            {resource.claims.map((claim: Claim) => (
              <SourcePanel key={claim.id} claim={claim} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-zinc-900/30 border border-zinc-800 text-zinc-400 text-xs">
            No claims currently linked to this resource. Click &ldquo;Extract Claims from Document&rdquo; above to extract claims verified against the source text.
          </div>
        )}
      </div>

      {/* Linked 3D Model Quick Box if Available */}
      {resource.model3d && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Interactive 3D Digital Twin Available
              </h3>
              <p className="text-xs text-zinc-400">{resource.model3d.label}</p>
            </div>
          </div>
          <a
            href={`/monument/${resource.monument_id}`}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
          >
            Open 3D Explorer
          </a>
        </div>
      )}

      {/* Cite Modal */}
      {showCiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-400" />
              Cite this Archival Resource
            </h3>
            <p className="text-xs text-zinc-400">
              Copy standard scholarly citation in MLA / Chicago format:
            </p>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 select-all break-words">
              {citationText}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCiteModal(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleCopyCitation}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                {copiedCite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCite ? "Copied!" : "Copy Citation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Error Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Report Archival Error or Discrepancy
            </h3>
            <p className="text-xs text-zinc-400">
              Submit corrections, missing citations, or copyright disputes directly to the reviewer queue:
            </p>
            {reportSubmitted ? (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-medium text-center">
                Thank you! Your report has been submitted to the admin review queue.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  placeholder="Describe the discrepancy, historical dispute, or required source correction..."
                  className="w-full text-xs p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


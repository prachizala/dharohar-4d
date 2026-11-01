"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  FileText,
  UserCheck,
  Clock,
  ExternalLink
} from "lucide-react";
import { useT } from "@/lib/i18n";

export default function ReviewPage() {
  const { t } = useT();
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState<any>({
    pending_resources: [],
    open_reports: [],
    pending_claims: [],
    recent_reviews: [],
  });
  const [actionReason, setActionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"resources" | "claims" | "reports" | "audit">("resources");

  const loadQueue = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/review/queue`, {
        headers: { "X-Admin-Token": authToken },
      });
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
        setAuthenticated(true);
        sessionStorage.setItem("dharohar_admin_token", authToken);
      } else {
        alert("Invalid admin token.");
        setAuthenticated(false);
      }
    } catch (err) {
      console.error("Queue load error:", err);
      alert("Failed to connect to review queue API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("dharohar_admin_token");
    if (saved) {
      setToken(saved);
      loadQueue(saved);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    loadQueue(token.trim());
  };

  const handleReviewResource = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/review/resource/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify({
          action,
          reason: actionReason || `Admin ${action}d resource`,
          reviewer: "Admin Reviewer",
        }),
      });
      if (res.ok) {
        setActionReason("");
        loadQueue(token);
      } else {
        const err = await res.json();
        alert(err.detail || "Action failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewClaim = async (id: number, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/review/claim/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify({
          status,
          reason: actionReason || `Admin marked ${status}`,
          reviewer: "Admin Reviewer",
        }),
      });
      if (res.ok) {
        setActionReason("");
        loadQueue(token);
      } else {
        const err = await res.json();
        alert(err.detail || "Action failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/review/report/${id}/resolve`, {
        method: "POST",
        headers: { "X-Admin-Token": token },
      });
      if (res.ok) {
        loadQueue(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Curator & Reviewer Login</h1>
          <p className="text-xs text-zinc-400">
            Enter the admin reviewer token to access pending uploads, claim verifications, and public discrepancy reports.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Admin Secret Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter ADMIN_TOKEN"
              className="w-full text-xs p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Access Review Queue</span>
          </button>

          <p className="text-[11px] text-zinc-500 text-center font-mono">
            Enter the ADMIN_TOKEN configured in your backend .env
          </p>
        </form>
      </div>
    );
  }

  const pendingResources = queue.pending_resources || [];
  const pendingClaims = queue.pending_claims || [];
  const openReports = queue.open_reports || [];
  const auditReviews = queue.recent_reviews || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Curatorial Review & Verification Portal</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Publish resources to the public FTS5 search index and authenticate historical claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadQueue(token)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 border border-zinc-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("dharohar_admin_token");
              setAuthenticated(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs border border-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 text-xs sm:text-sm font-semibold gap-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("resources")}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "resources"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Pending Resources</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[11px] font-mono text-zinc-300">
            {pendingResources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("claims")}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "claims"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Claim Authentications</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[11px] font-mono text-zinc-300">
            {pendingClaims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "reports"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Public Reports</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[11px] font-mono text-zinc-300">
            {openReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "audit"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span>Audit Log</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[11px] font-mono text-zinc-300">
            {auditReviews.length}
          </span>
        </button>
      </div>

      {/* Reviewer Note Input */}
      <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
        <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
          Reviewer Justification / Action Note:
        </label>
        <input
          type="text"
          value={actionReason}
          onChange={(e) => setActionReason(e.target.value)}
          placeholder="Optional: State academic justification for approval, verification, or dispute..."
          className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Tab 1: Pending Resources */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          {pendingResources.length > 0 ? (
            pendingResources.map((res: any) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4 shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 mr-2">
                      {res.type}
                    </span>
                    <span className="text-xs text-amber-400 font-medium">
                      Monument: {res.monument_name || `#${res.monument_id}`}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{res.title}</h3>
                    <p className="text-xs text-zinc-400">
                      Original: {res.original_name} &bull; Contributor: {res.contributor} &bull; License: {res.license}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewResource(res.id, "approve")}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Publish to FTS</span>
                    </button>
                    <button
                      onClick={() => handleReviewResource(res.id, "reject")}
                      className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Extracted text snippet */}
                {res.text && (
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {res.text.slice(0, 400)}...
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-xs">
              No resources currently awaiting review. All uploaded archives have been processed.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Claims Verification */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          {pendingClaims.length > 0 ? (
            pendingClaims.map((claim: any) => (
              <div
                key={claim.id}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                        {claim.type || "Claim"}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {claim.monument_name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Status: {claim.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">{claim.text}</p>
                    {claim.snippet && (
                      <p className="text-xs text-amber-200 italic bg-zinc-950 p-2 rounded border border-zinc-800">
                        Verified Snippet: &ldquo;{claim.snippet}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleReviewClaim(claim.id, "verified")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => handleReviewClaim(claim.id, "sourced")}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow"
                    >
                      Mark Sourced
                    </button>
                    <button
                      onClick={() => handleReviewClaim(claim.id, "disputed")}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow"
                    >
                      Mark Disputed
                    </button>
                    <button
                      onClick={() => handleReviewClaim(claim.id, "rejected")}
                      className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-xs">
              No claims currently in AI-suggested or disputed status.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Public Reports */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {openReports.length > 0 ? (
            openReports.map((rep: any) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Report #{rep.id} on {rep.target_type} #{rep.target_id}
                  </span>
                  <p className="text-xs text-zinc-200 mt-1">{rep.message}</p>
                  <span className="text-[10px] text-zinc-500 block">{rep.at}</span>
                </div>

                <button
                  onClick={() => handleResolveReport(rep.id)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700"
                >
                  Mark Resolved
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-xs">
              No open reports or user discrepancies.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === "audit" && (
        <div className="space-y-3">
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400">
            Immutable Review Log (spec requirement):
          </div>
          <div className="space-y-2">
            {auditReviews.map((rev: any) => (
              <div
                key={rev.id}
                className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs text-zinc-300 font-mono"
              >
                <div>
                  <strong className="text-amber-400">[{rev.action.toUpperCase()}]</strong> on {rev.target_type} #{rev.target_id} &mdash; {rev.reason}
                </div>
                <div className="text-zinc-500 text-[11px]">
                  by {rev.by} at {rev.at?.slice(0, 19)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


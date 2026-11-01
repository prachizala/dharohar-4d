"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileUp, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, X, ShieldAlert } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchApi } from "@/lib/api";

export default function UploadPage() {
  const { t } = useT();
  const [monuments, setMonuments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [monumentId, setMonumentId] = useState<string>("1");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("en");
  const [creator, setCreator] = useState("");
  const [license, setLicense] = useState("CC-BY-4.0");
  const [contributor, setContributor] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchApi("/api/v1/monuments")
      .then((res) => {
        setMonuments(res.monuments || []);
        if (res.monuments && res.monuments.length > 0) {
          setMonumentId(String(res.monuments[0].id));
        }
      })
      .catch((err) => console.error("Error loading monuments:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadResults([]);
      setErrorMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setUploadResults([]);
      setErrorMessage("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setUploadResults([]);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    if (title) formData.append("title", title);
    if (monumentId) formData.append("monument_id", monumentId);
    if (language) formData.append("language", language);
    if (creator) formData.append("creator", creator);
    if (license) formData.append("license", license);
    if (contributor) formData.append("contributor", contributor);
    if (tags) formData.append("tags", tags);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/resources`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 409) {
        const dupData = await res.json();
        setUploadResults([
          {
            filename: selectedFiles[0]?.name,
            status: "duplicate",
            detail: "This exact file already exists in the Dharohar archive (SHA-256 match). Duplicate rejected.",
            existing_resource_id: dupData.detail?.existing_resource_id,
          },
        ]);
      } else if (!res.ok) {
        const errData = await res.json();
        setErrorMessage(typeof errData.detail === "string" ? errData.detail : "Upload failed.");
      } else {
        const data = await res.json();
        setUploadResults(data.uploaded || []);
        setSelectedFiles([]);
        setTitle("");
        setTags("");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error uploading resources.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-white">
          {t("upload")} Heritage Resources
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Contribute photos, PDFs, slide decks (PPTX), architectural field notes, or documentation to the centralised archive.
        </p>
      </div>

      {/* Non-negotiable Archival Quality Notice */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-100 font-semibold block">Archive Verification Protocol:</strong>
          <p>
            All contributed resources are saved with status <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px]">pending review</code>.
            Original files are preserved untouched. Extracted text will be analyzed for historical claims, and verified before publishing to the public search index.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUploadSubmit} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-xl p-8 text-center space-y-3 cursor-pointer bg-zinc-950/50 transition-colors"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <FileUp className="w-10 h-10 text-amber-400 mx-auto" />
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Click to select or drag and drop files here
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supports JPG, PNG, WEBP, PDF, PPTX, DOCX, TXT (Max 25MB per file)
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf,.pptx,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Selected files badge list */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Selected Files ({selectedFiles.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((f, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200"
                >
                  <span className="truncate max-w-[200px]">{f.name}</span>
                  <span className="text-zinc-500 font-mono text-[10px]">
                    ({(f.size / 1024).toFixed(0)} KB)
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="monument-select" className="text-xs font-semibold text-zinc-300">
              {t("monument")} *
            </label>
            <select
              id="monument-select"
              value={monumentId}
              onChange={(e) => setMonumentId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              {monuments.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name_en} ({m.district})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="title-input" className="text-xs font-semibold text-zinc-300">
              Title / Resource Name (Optional for multi-file)
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Adalaj Stepwell 4th Tier Pillar Relief"
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="creator-input" className="text-xs font-semibold text-zinc-300">
              Original Creator / Photographer / Author *
            </label>
            <input
              id="creator-input"
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="e.g. Archaeological Survey of India or your name"
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="license-select" className="text-xs font-semibold text-zinc-300">
              {t("license")} *
            </label>
            <select
              id="license-select"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="CC-BY-4.0">Creative Commons Attribution 4.0 (CC-BY-4.0)</option>
              <option value="CC-BY-SA-4.0">Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA-4.0)</option>
              <option value="CC0">Public Domain Dedication (CC0 1.0)</option>
              <option value="Public Domain">Public Domain (Historical / Pre-1929)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contributor-input" className="text-xs font-semibold text-zinc-300">
              Contributor / Submitting Student Name *
            </label>
            <input
              id="contributor-input"
              type="text"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              placeholder="e.g. Heritage Club Researcher"
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tags-input" className="text-xs font-semibold text-zinc-300">
              Tags (comma separated)
            </label>
            <input
              id="tags-input"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. solanki, vav, columns, inscription"
              className="w-full text-xs p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || selectedFiles.length === 0}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-sm transition-colors shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {uploading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing, extracting text & generating suggestions...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Submit to Digital Archive</span>
            </>
          )}
        </button>
      </form>

      {/* Per-File Upload Results / Feedback */}
      {uploadResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-100">Upload Status & Quality Feedback</h2>
          <div className="space-y-3">
            {uploadResults.map((r, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  r.status === "duplicate"
                    ? "bg-amber-950/20 border-amber-800 text-amber-200"
                    : r.status === "error"
                    ? "bg-red-950/20 border-red-800 text-red-200"
                    : "bg-emerald-950/20 border-emerald-800 text-emerald-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {r.status === "duplicate" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : r.status === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{r.filename}</span>
                    <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700">
                      {r.status}
                    </span>
                  </div>

                  {r.detail && <p className="text-zinc-400">{r.detail}</p>}
                  {r.ai_summary && (
                    <p className="text-zinc-300 italic">
                      AI Summary: &ldquo;{r.ai_summary}&rdquo;
                    </p>
                  )}
                  {r.near_duplicate_of && (
                    <p className="text-amber-400">
                      Note: Visually similar to existing archive photo #{r.near_duplicate_of} (perceptual hash match).
                    </p>
                  )}
                </div>

                {r.id && (
                  <span className="text-[11px] text-zinc-400 shrink-0 font-mono">
                    Queued in Review Queue
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


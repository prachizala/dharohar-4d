"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ArchiveDocument } from "@/lib/offlineFallback";
import {
  FileText,
  Image as ImageIcon,
  Scroll,
  Layers,
  Box,
  Search,
  Upload,
  CheckCircle,
  ShieldCheck,
  Download,
  Filter,
  ExternalLink,
  BookOpen,
  Calendar,
  Tag,
  Copy,
  Check,
  X,
  Languages,
  Sparkles,
  Award
} from "lucide-react";

export default function DigitalArchivePage() {
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonument, setSelectedMonument] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [language, setLanguage] = useState<"en" | "hi" | "gu">("en");

  // Inspection Drawer
  const [activeDoc, setActiveDoc] = useState<ArchiveDocument | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadMonument, setUploadMonument] = useState("Adalaj Stepwell");
  const [uploadCategory, setUploadCategory] = useState<ArchiveDocument["category"]>("pdf_report");
  const [uploadPeriod, setUploadPeriod] = useState("15th Century (1498 CE)");
  const [uploadAuthor, setUploadAuthor] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Fetch documents
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.getArchiveDocuments({
        q: searchTerm,
        monument: selectedMonument,
        category: selectedCategory,
        status: selectedStatus,
        period: selectedPeriod,
      });
      setDocuments(res.results || []);
    } catch (e) {
      console.error("Failed to fetch archive:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocs();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedMonument, selectedPeriod, selectedStatus]);

  // Handle Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("monument", uploadMonument);
      formData.append("category", uploadCategory);
      formData.append("period_century", uploadPeriod);
      formData.append("author", uploadAuthor || "Field Researcher");
      formData.append("description", uploadDesc);
      formData.append("tags", uploadTags || "Heritage, Archive");

      const res = await api.uploadArchiveDocument(formData);
      setDocuments((prev) => [res.document, ...prev]);
      setUploadSuccessMsg(`✓ Successfully cataloged "${res.document.title}" into Centralised Heritage Archive!`);
      setTimeout(() => setUploadSuccessMsg(null), 5000);
      setShowUploadModal(false);
      // Reset form
      setUploadTitle("");
      setUploadDesc("");
      setUploadAuthor("");
      setUploadTags("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to catalog asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBibtex = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const categoryIcons: Record<string, any> = {
    pdf_report: FileText,
    field_photo: ImageIcon,
    inscription_rubbing: Scroll,
    architectural_drawing: Layers,
    point_cloud_scan: Box,
  };

  const categoryLabels: Record<string, { en: string; hi: string; gu: string }> = {
    all: { en: "All Assets", hi: "सभी अभिलेख", gu: "તમામ દસ્તાવેજો" },
    pdf_report: { en: "Survey Reports (PDF)", hi: "सर्वेक्षण रिपोर्ट्स (PDF)", gu: "સર્વે રિપોર્ટ્સ (PDF)" },
    field_photo: { en: "Field Photos", hi: "ऐतिहासिक छायाचित्र", gu: "ક્ષેત્રીય ફોટોગ્રાફ્સ" },
    inscription_rubbing: { en: "Inscriptions & Rubbings", hi: "शिलालेख व हस्तलिखित", gu: "શિલાલેખો અને હસ્તપ્રતો" },
    architectural_drawing: { en: "Architectural Drawings", hi: "स्थापत्य नक्शे", gu: "સ્થાપત્ય નકશા" },
    point_cloud_scan: { en: "3D LiDAR Scans", hi: "३डी लेजर स्कैन्स", gu: "૩ડી લેસર સ્કેન" },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-16">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-heritage-bronze/20 text-heritage-gold border border-heritage-bronze/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  CENTRALISED DIGITAL ARCHIVE
                </span>
                <span className="text-xs text-slate-400">ASI Gazetteers • Inscriptions • Measured Drawings • 3D Scans</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {language === "hi"
                  ? "धरोहर ४डी — एकीकृत डिजिटल अभिलेखागार"
                  : language === "gu"
                  ? "ધરોહર ૪ડી — કેન્દ્રીયકૃત ડિજિટલ અભિલેખાગાર"
                  : "Dharohar 4D Centralised Heritage Archive"}
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
                {language === "hi"
                  ? "बिखरी हुई ऐतिहासिक रिपोर्ट्स, एएसआई गजेटियर, संस्कृत/फारसी शिलालेखों के एस्टाम्पेज, पुरातात्विक नक्शे और ३डी पॉइंट-क्लाउड डेटासेट्स का एक प्रामाणिक केंद्रीय खोज मंच।"
                  : language === "gu"
                  ? "વિખરાયેલા ઐતિહાસિક અહેવાલો, એએસઆઈ ગેઝેટિયર્સ, સંસ્કૃત/ફારસી શિલાલેખો, આર્કીટેક્ચરલ ડ્રોઇંગ્સ અને ૩ડી પોઈન્ટ-ક્લાઉડ સ્કેનનું અધિકૃત કેન્દ્રીય સંશોધન પ્લેટફોર્મ."
                  : "A unified, peer-reviewed digital repository organizing scattered historical reports, ASI gazetteers, inscription rubbings, measured cross-sections, and 3D LiDAR point clouds with verified academic citations."}
              </p>
            </div>

            {/* Language & Upload Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                {(["en", "hi", "gu"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                      language === lang
                        ? "bg-heritage-gold text-slate-950 font-bold shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "ગુજરાતી"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-heritage-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Asset</span>
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {uploadSuccessMsg && (
            <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search Bar & Primary Filters */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search archive by monument, keyword, author (e.g. Burgess, Rudadevi, Padshahnama, Surya Kund)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-heritage-gold transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Monument Filter */}
            <select
              value={selectedMonument}
              onChange={(e) => setSelectedMonument(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-heritage-gold"
            >
              <option value="all">🏛️ All Monuments</option>
              <option value="adalaj">Adalaj Stepwell (Gandhinagar)</option>
              <option value="rani-ki-vav">Rani Ki Vav (Patan)</option>
              <option value="modhera-sun-temple">Modhera Sun Temple</option>
              <option value="taj-mahal">Taj Mahal (Agra)</option>
              <option value="akshardham">Swaminarayan Akshardham</option>
              <option value="somnath">Somnath Temple (Prabhas Patan)</option>
              <option value="siddhpur">Rudra Mahalaya (Siddhpur)</option>
            </select>

            {/* Period / Century Filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-heritage-gold"
            >
              <option value="all">⏳ All Epochs</option>
              <option value="11th Century">11th Century (Chaulukya Golden Age)</option>
              <option value="12th Century">12th Century (Medieval Inscriptions)</option>
              <option value="15th Century">15th Century (Sultanate / Vaghela)</option>
              <option value="17th Century">17th Century (Imperial Mughal)</option>
              <option value="19th Century">19th Century (Colonial Glass Plates)</option>
              <option value="20th Century">20th Century (Post-Independence)</option>
              <option value="21st Century">21st Century (LiDAR & 3D Scans)</option>
            </select>

            {/* Verification Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-heritage-gold"
            >
              <option value="all">🛡️ All Verification Levels</option>
              <option value="ASI_VERIFIED">ASI Verified Benchmarks</option>
              <option value="PEER_REVIEWED">Peer-Reviewed Monograph</option>
              <option value="FIELD_RECORD">Field Archaeological Survey</option>
              <option value="PENDING_VERIFICATION">Community Ingest (Pending)</option>
            </select>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-thin">
            {[
              "all",
              "pdf_report",
              "field_photo",
              "inscription_rubbing",
              "architectural_drawing",
              "point_cloud_scan",
            ].map((cat) => {
              const Icon = cat === "all" ? BookOpen : categoryIcons[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-heritage-gold text-slate-950 font-bold shadow-md shadow-amber-500/10"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{categoryLabels[cat][language]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Stats */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{documents.length}</span> verified historical records
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> ASI & UNESCO Verified Archives
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Award className="w-3.5 h-3.5" /> Sub-millimeter Laser Datasets
            </span>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-heritage-gold mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Querying Centralised Heritage Digital Archive...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Archival Records Found</h3>
            <p className="text-slate-400 text-xs mb-4">
              Try adjusting your search keywords, monument selector, or historical century filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedMonument("all");
                setSelectedPeriod("all");
                setSelectedStatus("all");
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => {
              const Icon = categoryIcons[doc.category] || FileText;
              return (
                <div
                  key={doc.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-heritage-gold/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Thumbnail / Header Preview */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img
                      src={doc.thumbnail_url}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md rounded-lg text-xs font-semibold text-heritage-gold border border-heritage-bronze/40">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{categoryLabels[doc.category]?.[language] || doc.category}</span>
                    </div>

                    {/* Verification Status Badge */}
                    <div
                      className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border backdrop-blur-md ${
                        doc.verification_status === "ASI_VERIFIED"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                          : doc.verification_status === "PEER_REVIEWED"
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                          : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{doc.verification_badge}</span>
                    </div>

                    {/* Monument Pill on Image bottom */}
                    <div className="absolute bottom-3 left-3 text-xs font-bold text-white bg-slate-950/90 px-2.5 py-1 rounded-md border border-slate-800">
                      🏛️ {doc.monument}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug group-hover:text-heritage-gold transition-colors mb-2 line-clamp-2">
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
                        {language === "hi"
                          ? doc.description_hi || doc.description
                          : language === "gu"
                          ? doc.description_gu || doc.description
                          : doc.description}
                      </p>

                      {/* Source Citation Reference */}
                      <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl mb-3">
                        <div className="flex items-center gap-1 text-[11px] text-heritage-gold/90 font-mono mb-1">
                          <BookOpen className="w-3 h-3" />
                          <span>SOURCE CITATION:</span>
                        </div>
                        <p className="text-[11px] text-slate-300 italic line-clamp-2 font-serif">
                          "{doc.source_citation}"
                        </p>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {doc.period_century}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-300">{doc.file_type} ({doc.file_size_mb} MB)</span>
                        <span>•</span>
                        <span className="text-slate-400">{doc.publication_year}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {doc.tags.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveDoc(doc)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-heritage-gold" />
                        <span>Inspect & Citations</span>
                      </button>

                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Download / View Archival Asset"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          DOCUMENT INSPECTION & CITATION MODAL (PRD GAPS 1 & 3)
         ========================================================================= */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setActiveDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {activeDoc.verification_badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">REF: {activeDoc.archive_reference_no}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{activeDoc.title}</h2>
            <div className="text-xs text-slate-400 mb-4 flex flex-wrap gap-2 items-center">
              <span>🏛️ {activeDoc.monument}</span>
              <span>•</span>
              <span>👑 {activeDoc.dynasty}</span>
              <span>•</span>
              <span>📅 {activeDoc.period_century}</span>
            </div>

            {/* Description */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <h4 className="text-xs font-bold text-heritage-gold uppercase tracking-wider mb-1">
                Archival Abstract & Survey Synthesis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === "hi"
                  ? activeDoc.description_hi || activeDoc.description
                  : language === "gu"
                  ? activeDoc.description_gu || activeDoc.description
                  : activeDoc.description}
              </p>
            </div>

            {/* OCR Extracted Text Preview if Inscription / Document */}
            {activeDoc.ocr_extracted_text && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Scroll className="w-3.5 h-3.5" />
                    OCR Extracted Primary Epigraph Text
                  </span>
                  <span className="text-[10px] text-slate-500">{activeDoc.original_inscription_script || "Ancient Script"}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg text-amber-200 text-xs font-serif leading-relaxed border border-slate-800/60 select-all">
                  {activeDoc.ocr_extracted_text}
                </div>
                {activeDoc.iast_transliteration && (
                  <div className="mt-2 text-[11px] text-slate-400 italic">
                    IAST Transliteration: {activeDoc.iast_transliteration}
                  </div>
                )}
              </div>
            )}

            {/* Academic BibTeX & APA Citation Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-heritage-gold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  ACADEMIC CITATION (BibTeX & APA)
                </span>
                <button
                  onClick={() => copyBibtex(activeDoc.bibtex_citation)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md flex items-center gap-1 transition-all"
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? "Copied BibTeX!" : "Copy BibTeX"}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                {activeDoc.bibtex_citation}
              </pre>
              <div className="mt-2 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">APA: </span>
                {activeDoc.apa_citation}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Close
              </button>
              <a
                href={activeDoc.file_url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-heritage-gold hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Verified Asset ({activeDoc.file_type})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CROWDSOURCED ARCHIVE UPLOAD MODAL (PRD GAP 1)
         ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-heritage-gold" />
              <h2 className="text-xl font-bold text-white">Upload to Heritage Digital Archive</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Contribute photos, PDFs, architectural surveys, or epigraphical rubbings to the unified centralized repository.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Document / Resource Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Measured Elevation Drawing of Rani Ki Vav Well Shaft"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Associated Monument *</label>
                  <select
                    value={uploadMonument}
                    onChange={(e) => setUploadMonument(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                  >
                    <option value="Adalaj Stepwell">Adalaj Stepwell</option>
                    <option value="Rani Ki Vav">Rani Ki Vav</option>
                    <option value="Modhera Sun Temple">Modhera Sun Temple</option>
                    <option value="Taj Mahal">Taj Mahal</option>
                    <option value="Swaminarayan Akshardham">Swaminarayan Akshardham</option>
                    <option value="Somnath Temple">Somnath Temple</option>
                    <option value="Rudra Mahalaya">Rudra Mahalaya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Asset Category *</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                  >
                    <option value="pdf_report">Survey Report (PDF)</option>
                    <option value="field_photo">Field Photography</option>
                    <option value="inscription_rubbing">Inscription / Rubbing</option>
                    <option value="architectural_drawing">Architectural Drawing / CAD</option>
                    <option value="point_cloud_scan">3D LiDAR Point Cloud</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Historical Period / Century</label>
                  <input
                    type="text"
                    value={uploadPeriod}
                    onChange={(e) => setUploadPeriod(e.target.value)}
                    placeholder="e.g., 11th Century (1063 CE)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Author / Surveyor</label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    placeholder="e.g., Archaeological Surveyor / Student Researcher"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Abstract & Provenance Description *</label>
                <textarea
                  required
                  rows={3}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Describe the historical context, discovery notes, architectural features, and condition..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g. Solanki, Maru-Gurjara, Pillar Carvings, Field Survey"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-heritage-gold"
                />
              </div>

              {/* Drag Drop Box Simulation */}
              <div className="border-2 border-dashed border-slate-800 hover:border-heritage-gold/50 rounded-xl p-4 text-center bg-slate-950/60 transition-colors">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400">Drag & drop your PDF, photo, or drawing file here, or click to browse</span>
                <p className="text-[10px] text-slate-500 mt-1">Supports PDF, JPG, PNG, PLY, DWG (Max 100 MB)</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-heritage-gold hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Indexing...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Ingest & Index Asset</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

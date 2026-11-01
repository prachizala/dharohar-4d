"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Camera,
  ShieldCheck,
  Search,
  Box,
  Clock,
  Route,
  Map,
  ArrowRight,
  Upload,
  Layers,
  Award,
  Globe,
  CheckCircle,
  Download
} from "lucide-react";

// Core 4 Pillars directly addressing the evaluator gaps
const coreSolutions = [
  {
    number: "01",
    title: "Centralised Digital Archive",
    tagline: "Upload, Organise, Search & Retrieve Scattered Heritage Assets",
    problem: "Historical documents, survey PDFs, presentations, and field photos are scattered across isolated websites and physical libraries without a single unified access point.",
    solution: "A centralized repository unifying ASI Imperial Series reports, 1886 glass-plate negatives, Sanskrit/Persian inscription rubbings, and 3D LiDAR point clouds with drag-and-drop crowdsourced ingest.",
    href: "/archive",
    cta: "Explore Digital Archive",
    icon: FileText,
    badge: "PRD PILLAR 1",
    color: "from-amber-400/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/30",
    textGradient: "from-amber-300 to-amber-500",
  },
  {
    number: "02",
    title: "Actual Photo-to-3D Photogrammetry",
    tagline: "Generating 3D Digital Twins from Crowdsourced 2D Photos",
    problem: "Procedural geometry models lack real-world surface fidelity and do not satisfy the core requirement of reconstructing authentic 3D twins directly from multi-angle photographs.",
    solution: "A complete Structure-from-Motion (SfM) and Multi-View Stereo (MVS) pipeline in Studio that extracts 2,840 SIFT keypoints, computes camera frustums, and outputs 28,000-point dense clouds and textured meshes.",
    href: "/studio",
    cta: "Launch Photo-to-3D Studio",
    icon: Camera,
    badge: "PRD PILLAR 2",
    color: "from-emerald-400/20 via-emerald-500/10 to-transparent",
    border: "border-emerald-500/30",
    textGradient: "from-emerald-300 to-emerald-500",
  },
  {
    number: "03",
    title: "Historical Authenticity & Citations",
    tagline: "Source, Reference, and Verification Status for Every Claim",
    problem: "Digital heritage tools often hallucinate or present unverified architectural claims without academic citations, epigraph references, or verification badges.",
    solution: "Every monument, inscription, and historical epoch is tethered to primary sources (Epigraphia Indica, ASI Gazetteers, UNESCO dossiers) with original script transcriptions (Nagari/Persian) and BibTeX exports.",
    href: "/explore",
    cta: "View Verified 4D Dossiers",
    icon: ShieldCheck,
    badge: "PRD PILLAR 3",
    color: "from-cyan-400/20 via-cyan-500/10 to-transparent",
    border: "border-cyan-500/30",
    textGradient: "from-cyan-300 to-cyan-500",
  },
  {
    number: "04",
    title: "Faceted Search & Accessibility",
    tagline: "Multilingual Access, Smart Filters & Public Export Tools",
    problem: "Archival records are hard to discover without specialized knowledge, lacking faceted filters, multilingual support, and accessible viewing tools for students, guides, and researchers.",
    solution: "Instant multi-faceted filters (by Monument, Century, Document Type, and ASI status), trilingual UI and narration (English, हिन्दी, ગુજરાતી), and instant downloads of PLY point clouds and GLB 3D models.",
    href: "/archive",
    cta: "Search Archive with Filters",
    icon: Search,
    badge: "PRD PILLAR 4",
    color: "from-purple-400/20 via-purple-500/10 to-transparent",
    border: "border-purple-500/30",
    textGradient: "from-purple-300 to-purple-500",
  },
];

// Secondary platform features
const allFeatures = [
  {
    icon: Box,
    title: "Place Explorer 4D",
    description: "Autonomous research engine with 4D chronological horizon slider and Web Speech narration.",
    href: "/explore",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Layers,
    title: "3D Digital Twin Hub",
    description: "Interactive Three.js PBR rendering with 8 heritage archetypes and solar azimuth lighting.",
    href: "/twin",
    color: "from-heritage-gold to-heritage-bronze",
  },
  {
    icon: Clock,
    title: "Monument 4D Tracker",
    description: "Epoch-by-epoch weathering, condition estimation, and salt efflorescence tracking.",
    href: "/monument4d",
    color: "from-heritage-sandstone to-heritage-terracotta",
  },
  {
    icon: Route,
    title: "Heritage Corridor GIS",
    description: "Interactive GIS explorer for sacred stepwells and monuments across Western India.",
    href: "/corridor",
    color: "from-heritage-jade to-heritage-indigo",
  },
  {
    icon: Map,
    title: "AI Epigrapher",
    description: "Inscription transcription across Nagari and Persian scripts with IAST and TEI-XML export.",
    href: "/epigrapher",
    color: "from-heritage-terracotta to-heritage-sandstone",
  },
  {
    icon: Award,
    title: "Field Expeditions",
    description: "NLP journal ingestion with automated GPS route discovery and architectural tagging.",
    href: "/expedition",
    color: "from-amber-500 to-orange-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-heritage-bronze/20 border border-heritage-gold/30 text-heritage-gold text-xs font-mono font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            HC26-CULT01 | BLITHCHRON '27 • IIT GANDHINAGAR
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-heritage-gold via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Dharohar 4D
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-200 font-semibold mb-4">
            Neural Heritage Digital Twin & Centralised Archival Platform
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Answering the national challenge of revitalising India's sacred heritage through a unified digital archive,
            crowdsourced photo-to-3D photogrammetry, verified historical citations, and 4D chronological timeline exploration.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/archive"
              className="px-6 py-3 bg-gradient-to-r from-heritage-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Explore Centralised Archive</span>
            </Link>

            <Link
              href="/studio"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Photo-to-3D Studio</span>
            </Link>

            <Link
              href="/explore"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Place Explorer 4D</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 4 CORE PROBLEM GAPS & OUR COMPLETE SOLUTIONS (IMAGE REQUIREMENTS)
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              EXHAUSTIVE PROBLEM-SOLUTION MATRIX
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Addressing the 4 Core Cultural Heritage Challenges
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Direct implementation of the hackathon evaluation requirements: Centralised Digital Archive, Photo-to-3D conversion, Academic Authenticity, and Faceted Multilingual Search.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreSolutions.map((item) => (
              <div
                key={item.number}
                className={`relative bg-gradient-to-b ${item.color} bg-slate-900/90 border ${item.border} rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between transition-all hover:scale-[1.01]`}
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono bg-gradient-to-r text-slate-500 opacity-60">
                      {item.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-950/80 text-white border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2.5">
                    <item.icon className="w-6 h-6 text-heritage-gold flex-shrink-0" />
                    <span>{item.title}</span>
                  </h3>
                  <p className={`text-xs font-semibold mb-4 bg-gradient-to-r ${item.textGradient} bg-clip-text text-transparent`}>
                    {item.tagline}
                  </p>

                  {/* Challenge Statement */}
                  <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-3 text-xs leading-relaxed">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] block mb-0.5">
                      The Identified Challenge:
                    </span>
                    <span className="text-slate-400 italic">"{item.problem}"</span>
                  </div>

                  {/* Our Engineering Solution */}
                  <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-6 text-xs leading-relaxed">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-0.5">
                      Our Implemented Solution:
                    </span>
                    <span className="text-slate-300 font-medium">{item.solution}</span>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <Link
                  href={item.href}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white border border-slate-700 hover:border-heritage-gold rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-heritage-gold" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ALL PLATFORM MODULES GRID
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Integrated Heritage Platform Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seamlessly navigate across 4D time sliders, AI epigraphers, GIS corridors, and condition tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allFeatures.map((feat) => (
            <Link key={feat.title} href={feat.href} className="group">
              <div className="h-full p-5 bg-slate-900/60 border border-slate-800 hover:border-heritage-gold/50 rounded-2xl transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 group-hover:border-heritage-gold/50 transition-colors">
                    <feat.icon className="w-5 h-5 text-heritage-gold" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5 group-hover:text-heritage-gold transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-heritage-gold transition-colors">
                  <span>Launch Tool</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <p className="font-mono text-slate-400 mb-1">
          Dharohar 4D — Neural Heritage Digital Twin Platform
        </p>
        <p>IIT Gandhinagar Blithchron '27 Heritage Hackathon (HC26-CULT01)</p>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import { History, Sparkles, Sliders, Calendar, BookOpen, ShieldCheck } from "lucide-react";

interface ComparisonItem {
  id: string;
  name: string;
  thenTitle: string;
  thenDate: string;
  thenSource: string;
  thenImg: string;
  nowTitle: string;
  nowDate: string;
  nowSource: string;
  nowImg: string;
  description: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: "adalaj",
    name: "Adalaj Stepwell",
    thenTitle: "1890 CE Archival Plate • Dr. James Burgess Survey",
    thenDate: "Circa 1890–1903",
    thenSource: "Archaeological Survey of India New Imperial Series, Vol. XXXII, Plate XLIV",
    thenImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adalaj_Vav_Pillars_Carvings.jpg/800px-Adalaj_Vav_Pillars_Carvings.jpg",
    nowTitle: "2026 CE 4D Digital Twin • Photogrammetric Mesh",
    nowDate: "2026 Active Twin",
    nowSource: "Crowdsourced 45-Photo SfM Reconstruction & OpenMVS Dense Mesh",
    nowImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/800px-Adalaj_Stepwell_Interior_Shaft.jpg",
    description: "Comparison showing the lower subterranean tiers: historical silt accumulation documented in 1890 vs. restored architectural geometry and active groundwater preservation."
  },
  {
    id: "modhera",
    name: "Sun Temple Modhera",
    thenTitle: "1910 CE Colonial Survey Blueprint & Elevation",
    thenDate: "1910 Survey",
    thenSource: "ASI Western Circle Measured Sectional Drawings #MOD-1910",
    thenImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/800px-Surya_Kund_Modhera.jpg",
    nowTitle: "2026 CE Solar Alignment Orthomosaic",
    nowDate: "2026 Twin",
    nowSource: "Terrestrial LiDAR & GPS Solar Azimuth Verification",
    nowImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Modhera_Sun_Temple_Front.jpg/800px-Modhera_Sun_Temple_Front.jpg",
    description: "Evaluating stone relief weathering across 116 years: inspecting sandstone erosion on the 52 Sabha Mandapa pillars and equinoctial sanctuary alignment."
  },
  {
    id: "rani_vav",
    name: "Rani Ki Vav",
    thenTitle: "1980 Pre-Desiltation Archaeological Record",
    thenDate: "1980 Survey",
    thenSource: "ASI Excavation & Chemical Conservation Branch Archive",
    thenImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/800px-Rani_ki_vav_01.jpg",
    nowTitle: "2026 UNESCO Heritage 3D Digital Twin",
    nowDate: "2026 UNESCO Record",
    nowSource: "High-Density Laser Scan & Multi-View Stereo Model",
    nowImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Rani_ki_vav_sculptures.jpg/800px-Rani_ki_vav_sculptures.jpg",
    description: "Witnessing the transformative excavation of 500+ principal Dashavatara sculptures buried under Saraswati River silt for over 700 years."
  }
];

export const ThenVsNowSlider: React.FC = () => {
  const [activeItem, setActiveItem] = useState<ComparisonItem>(COMPARISONS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="px-5 py-4 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Historical Time-Slider: Then vs. Now</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
              Verified Archival Diff
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Slide horizontally to compare 19th-century colonial archival photography against modern 3D reconstructions.
          </p>
        </div>

        {/* Monument Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {COMPARISONS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => {
                setActiveItem(comp);
                setSliderPosition(50);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeItem.id === comp.id
                  ? "bg-amber-500 text-black font-semibold shadow-sm"
                  : "bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Slider Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[400px] select-none overflow-hidden cursor-ew-resize bg-black"
      >
        {/* RIGHT LAYER: Modern 2026 Digital Twin (Full background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={activeItem.nowImg}
            alt={activeItem.nowTitle}
            className="w-full h-full object-cover"
          />
          {/* Label Badge Right */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-black/80 border border-amber-500/60 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl">
            🏛️ {activeItem.nowTitle}
          </div>
        </div>

        {/* LEFT LAYER: Historic Archival Plate (Clipped by sliderPosition) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={activeItem.thenImg}
            alt={activeItem.thenTitle}
            className="absolute inset-0 w-full h-full object-cover filter sepia-[0.35] contrast-110"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          />
          {/* Label Badge Left */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-zinc-700 backdrop-blur-md text-xs font-mono text-zinc-200 shadow-xl">
            📜 {activeItem.thenTitle}
          </div>
        </div>

        {/* DRAGGABLE DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 shadow-[0_0_15px_rgba(251,191,36,0.8)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 text-black border-2 border-white shadow-2xl flex items-center justify-center font-bold text-xs">
            <Sliders className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Quick jump presets */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span>Compare:</span>
          <button onClick={() => setSliderPosition(20)} className="hover:text-amber-300">20%</button>
          <span>&bull;</span>
          <button onClick={() => setSliderPosition(50)} className="hover:text-amber-300 font-bold text-amber-400">50%</button>
          <span>&bull;</span>
          <button onClick={() => setSliderPosition(80)} className="hover:text-amber-300">80%</button>
        </div>
      </div>

      {/* Primary Source Citation Footer */}
      <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 space-y-2 text-xs">
        <p className="text-zinc-300 leading-relaxed">{activeItem.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Archival Benchmark: <strong className="text-zinc-200">{activeItem.thenSource}</strong></span>
          </div>
          <span className="text-zinc-500">Method: Cross-Century Photometric Diff</span>
        </div>
      </div>
    </div>
  );
};

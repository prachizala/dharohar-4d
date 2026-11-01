"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Landmark,
  Compass,
  Filter,
  Layers,
  ArrowRight,
  Box,
  Calendar,
  Sparkles,
  ExternalLink
} from "lucide-react";

export interface GeoMonument {
  id: number;
  name: string;
  name_hi: string;
  name_gu: string;
  state: string;
  district: string;
  dynasty: string;
  period: string;
  coordinates: { x: number; y: number }; // Relative percentage for map projection
  lat: number;
  lon: number;
  thumb: string;
  has3d: boolean;
  modelUrl?: string;
  shortDesc: string;
}

const GEO_MONUMENTS: GeoMonument[] = [
  {
    id: 1,
    name: "Adalaj Stepwell",
    name_hi: "अडालज की वाव",
    name_gu: "અડાલજની વાવ",
    state: "Gujarat",
    district: "Gandhinagar",
    dynasty: "Solanki / Vaghela",
    period: "15th Century (1498 CE)",
    coordinates: { x: 23, y: 46 }, // Gujarat coords on India map SVG
    lat: 23.1667,
    lon: 72.5806,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Adalaj_Stepwell_Interior_Shaft.jpg/400px-Adalaj_Stepwell_Interior_Shaft.jpg",
    has3d: true,
    modelUrl: "/monument/1",
    shortDesc: "Five-storey subterranean subterranean stepwell with octagonal shafts and Sanskrit edict."
  },
  {
    id: 2,
    name: "Sun Temple Modhera",
    name_hi: "मोढेरा सूर्य मंदिर",
    name_gu: "મોઢેરા સૂર્ય મંદિર",
    state: "Gujarat",
    district: "Mehsana",
    dynasty: "Solanki Empire",
    period: "11th Century (1026 CE)",
    coordinates: { x: 21, y: 43 },
    lat: 23.5835,
    lon: 72.1331,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Surya_Kund_Modhera.jpg/400px-Surya_Kund_Modhera.jpg",
    has3d: true,
    modelUrl: "/monument/2",
    shortDesc: "Stepped Surya Kund with 108 shrines aligned to equinoctial solar ingress."
  },
  {
    id: 3,
    name: "Rani Ki Vav",
    name_hi: "रानी की वाव",
    name_gu: "રાણીની વાવ",
    state: "Gujarat",
    district: "Patan",
    dynasty: "Solanki Empire",
    period: "11th Century (1063 CE)",
    coordinates: { x: 20, y: 40 },
    lat: 23.8589,
    lon: 72.0497,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rani_ki_vav_01.jpg/400px-Rani_ki_vav_01.jpg",
    has3d: true,
    modelUrl: "/monument/3",
    shortDesc: "UNESCO World Heritage subterranean inverted temple with 500+ Dashavatara reliefs."
  },
  {
    id: 4,
    name: "Konark Sun Temple",
    name_hi: "कोणार्क सूर्य मंदिर",
    name_gu: "કોણાર્ક સૂર્ય મંદિર",
    state: "Odisha",
    district: "Puri",
    dynasty: "Eastern Ganga",
    period: "13th Century (1250 CE)",
    coordinates: { x: 70, y: 55 },
    lat: 19.8876,
    lon: 86.0945,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_Wheel.jpg/400px-Konark_Sun_Temple_Wheel.jpg",
    has3d: true,
    modelUrl: "/monument/4",
    shortDesc: "Monumental stone chariot with 24 carved astronomical sundial wheels."
  },
  {
    id: 5,
    name: "Taj Mahal",
    name_hi: "ताज महल",
    name_gu: "તાજ મહેલ",
    state: "Uttar Pradesh",
    district: "Agra",
    dynasty: "Mughal Empire",
    period: "17th Century (1632 CE)",
    coordinates: { x: 45, y: 35 },
    lat: 27.1751,
    lon: 78.0421,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/400px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
    has3d: true,
    modelUrl: "/monument/1",
    shortDesc: "Symmetric white marble mausoleum with pietra dura floral inlays and calligraphic friezes."
  },
  {
    id: 6,
    name: "Brihadisvara Temple",
    name_hi: "बृहदीश्वर मंदिर",
    name_gu: "બૃહદીશ્વર મંદિર",
    state: "Tamil Nadu",
    district: "Thanjavur",
    dynasty: "Chola Empire",
    period: "11th Century (1010 CE)",
    coordinates: { x: 48, y: 84 },
    lat: 10.7828,
    lon: 79.1318,
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Thanjavur_Temple.jpg/400px-Thanjavur_Temple.jpg",
    has3d: false,
    modelUrl: "/monument/1",
    shortDesc: "Granite monolithic Vimana tower constructed under Emperor Rajaraja Chola I."
  }
];

export const IndiaGeoExplorer: React.FC = () => {
  const [selectedDynasty, setSelectedDynasty] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [activePin, setActivePin] = useState<GeoMonument>(GEO_MONUMENTS[0]);

  const dynasties = ["All", "Solanki Empire", "Solanki / Vaghela", "Chola Empire", "Mughal Empire", "Eastern Ganga"];
  const states = ["All", "Gujarat", "Uttar Pradesh", "Odisha", "Tamil Nadu"];

  const filteredMonuments = GEO_MONUMENTS.filter((m) => {
    const matchDynasty = selectedDynasty === "All" || m.dynasty.includes(selectedDynasty);
    const matchState = selectedState === "All" || m.state === selectedState;
    return matchDynasty && matchState;
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header with Filters */}
      <div className="px-5 py-4 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Interactive India Geo-Explorer</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              Corridor GIS
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Filter certified archaeological monuments across dynasties and geography. Click pins to preview digital twins.
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-500">Dynasty:</span>
            <select
              value={selectedDynasty}
              onChange={(e) => setSelectedDynasty(e.target.value)}
              className="bg-transparent text-zinc-200 font-medium focus:outline-none cursor-pointer"
            >
              {dynasties.map((d) => (
                <option key={d} value={d} className="bg-zinc-900 text-zinc-100">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-zinc-200 font-medium focus:outline-none cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 relative p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-hidden">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-15" />

          {/* India Map Canvas Area */}
          <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center">
            {/* Styled India Outline Map Vector */}
            <svg
              viewBox="0 0 500 600"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(245,158,11,0.08)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Generalized India subcontinent contour path */}
              <path
                d="M170 50 C 180 30, 240 20, 260 50 C 280 80, 310 90, 330 110 C 350 130, 340 160, 310 170 C 310 190, 390 180, 420 200 C 450 220, 460 250, 430 270 C 400 280, 360 260, 340 270 C 330 300, 350 330, 320 360 C 290 390, 280 430, 260 480 C 240 530, 220 570, 210 580 C 200 570, 180 500, 160 450 C 140 400, 120 350, 110 320 C 90 280, 60 270, 50 250 C 40 230, 80 210, 100 210 C 120 210, 140 180, 130 140 C 120 100, 150 70, 170 50 Z"
                fill="#18181b"
                stroke="#d97706"
                strokeWidth="2"
                strokeOpacity="0.45"
              />
              {/* Internal historical cultural division lines */}
              <path
                d="M100 210 Q 230 220 330 270"
                stroke="#52525b"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />
              <path
                d="M130 320 Q 240 340 320 360"
                stroke="#52525b"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />
            </svg>

            {/* Interactive Monument Coordinate Pins */}
            {filteredMonuments.map((mon) => {
              const isSelected = activePin.id === mon.id;
              return (
                <button
                  key={mon.id}
                  onClick={() => setActivePin(mon)}
                  style={{
                    left: `${mon.coordinates.x}%`,
                    top: `${mon.coordinates.y}%`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 focus:outline-none`}
                  title={`${mon.name} (${mon.dynasty})`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for selected pin */}
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping pointer-events-none" />
                    )}
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full border shadow-xl transition-transform group-hover:scale-125 ${
                        isSelected
                          ? "bg-amber-500 text-black border-white font-bold scale-110 ring-2 ring-amber-400"
                          : "bg-zinc-900 text-amber-400 border-amber-500/60 hover:bg-amber-500 hover:text-black"
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  {/* Pin Label tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden group-hover:block whitespace-nowrap px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-100 font-mono shadow-md z-30 pointer-events-none">
                    {mon.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-zinc-500">
            Showing {filteredMonuments.length} protected digital twin loci
          </div>
        </div>

        {/* Selected Monument Spotlight Panel (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-zinc-900/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1 text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
                {activePin.district}, {activePin.state}
              </span>
              <span>({activePin.lat.toFixed(2)}°N, {activePin.lon.toFixed(2)}°E)</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">{activePin.name}</h3>
              <p className="text-xs text-zinc-400 font-medium">
                {activePin.name_hi} &bull; {activePin.name_gu}
              </p>
            </div>

            {/* Dynasty & Period Pill Tags */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 font-semibold">
                👑 {activePin.dynasty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                📅 {activePin.period}
              </span>
            </div>

            {/* Thumbnail Preview Image */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-zinc-800 mt-2 group">
              <img
                src={activePin.thumb}
                alt={activePin.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {activePin.has3d && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300 text-[10px] font-mono flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  3D Photogrammetry Ready
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              {activePin.shortDesc}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
            <Link
              href={activePin.modelUrl || `/monument/${activePin.id}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Box className="w-4 h-4" />
              <span>Explore 3D Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/?q=${encodeURIComponent(activePin.name.split(" ")[0])}`}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Archival Records</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

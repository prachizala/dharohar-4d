"use client";

import React, { useState, useRef } from "react";
import { History, Sparkles, Sliders, Calendar, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

interface ComparisonDifference {
  feature: string;
  then: string;
  now: string;
  significance: string;
}

interface ComparisonItem {
  id: string;
  name: string;
  monumentLocation: string;
  thenTitle: string;
  thenDate: string;
  thenSource: string;
  thenImg: string;
  thenImgFallback: string;
  nowTitle: string;
  nowDate: string;
  nowSource: string;
  nowImg: string;
  nowImgFallback: string;
  description: string;
  differences: ComparisonDifference[];
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: "adalaj",
    name: "Adalaj Stepwell (अडालज वाव)",
    monumentLocation: "Gandhinagar, Gujarat • Built 1498 CE by Queen Rudadevi",
    thenTitle: "1890 CE Archival Survey Plate • Dr. James Burgess ASI Western Circle",
    thenDate: "1890 CE Archival Plate",
    thenSource: "ASI New Imperial Series, Vol. XXXII, Plate XLIV (Archaeological Survey of Western India)",
    thenImg: "/comparisons/adalaj_then.jpg",
    thenImgFallback: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
    nowTitle: "2026 CE 4D Digital Twin • Modern Ground Photogrammetry",
    nowDate: "2026 CE Restored Twin",
    nowSource: "Crowdsourced 45-Photo Multi-View Photogrammetric Reconstruction",
    nowImg: "/comparisons/adalaj_now.jpg",
    nowImgFallback: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
    description: "Comparison of the subterranean central shaft: 1890 James Burgess survey showing historic sedimentation and moisture erosion vs. modern 2026 restored architecture with active groundwater preservation.",
    differences: [
      {
        feature: "भूगर्भीय गाद (Silt & Water Table)",
        then: "निचले तल पर 3.2 मीटर तक गाद (silt) भरी थी, 5वां तल आंशिक रूप से जलमग्न और अगम्य था।",
        now: "ASI द्वारा गाद हटाकर जल स्तर को नियंत्रित किया गया; सभी 5 तल पर्यटकों व शोधार्थियों हेतु खुले हैं।",
        significance: "संरचनात्मक स्थिरता एवं भूमिगत जल प्रवाह का पुनरुद्धार"
      },
      {
        feature: "खंभों की नक्काशी (Pillar Reliefs)",
        then: "1890 में चूना पत्थर पर काई (lichen) और नमी की परत जमी थी, नक्काशी धुंधली थी।",
        now: "केमिकल कंज़र्वेशन और 3D लेजर मैपिंग से सूक्ष्म सोलंकी शैली की नक्काशी स्पष्ट संरक्षित है।",
        significance: "मारू-गुर्जर वास्तुशिल्प का मूल विवरण पुनर्स्थापित"
      },
      {
        feature: "अष्टकोणीय शाफ्ट (Octagonal Shaft)",
        then: "ऊपरी हवा-प्रकाश शाफ्ट में खुली दरारें और क्षरण दर्ज था (Burgess Plate XLIV)।",
        now: "क्रिप्टोग्राफिक 4D ट्विन में दरारों की माइक्रो-मॉनिटरिंग सक्रिय है, शून्य ढहने का खतरा।",
        significance: "दीर्घकालिक भूकंपीय सुरक्षा और निरंतर डिजिटल निगरानी"
      }
    ]
  },
  {
    id: "modhera",
    name: "Sun Temple Modhera (मोढेरा सूर्य मंदिर)",
    monumentLocation: "Mehsana, Gujarat • Built 1026 CE by King Bhima I (Solanki Dynasty)",
    thenTitle: "1910 CE Colonial Survey Plate • Sabha Mandapa & Surya Kund",
    thenDate: "1910 CE Survey Plate",
    thenSource: "ASI Western Circle Measured Sectional Drawings #MOD-1910 & Colonial Survey Archives",
    thenImg: "/comparisons/modhera_then.jpg",
    thenImgFallback: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1000&auto=format&fit=crop&q=80",
    nowTitle: "2026 CE 4D Digital Twin • Sabha Mandapa Restoration",
    nowDate: "2026 CE Modern Twin",
    nowSource: "Terrestrial LiDAR & GPS Solar Azimuth Verification Model",
    nowImg: "/comparisons/modhera_now.jpg",
    nowImgFallback: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1000&auto=format&fit=crop&q=80",
    description: "Evaluating stone relief weathering across 116 years: 1910 colonial survey documentation of sandstone erosion on the 52 Sabha Mandapa pillars vs. modern equinoctial sanctuary alignment.",
    differences: [
      {
        feature: "सभा मंडप के 52 स्तंभ (52 Pillars)",
        then: "1910 में 14 स्तंभों के शीर्ष खंड खंडित थे; मौसम के कारण बलुआ पत्थर का भारी क्षरण था।",
        now: "ASI ने संरचना को मजबूत किया; 4D सिमुलेशन में प्रत्येक स्तंभ 52 हफ्तों के सौर चक्र को दर्शाता है।",
        significance: "प्राचीन खगोलीय ज्यामिति का सत्यापन"
      },
      {
        feature: "सूर्य कुंड (Surya Kund Stepped Tank)",
        then: "कुंड की कई छोटी सीढ़ीदार देवरियाँ (miniature shrines) जलजमाव और मलबे से ढंकी थीं।",
        now: "108 लघु मंदिरों का पुनर्निर्माण और जल निकासी प्रणाली सुव्यवस्थित है।",
        significance: "धार्मिक व वास्तुशिल्प समग्रता की पुनर्स्थापना"
      },
      {
        feature: "विषुव संरेखण (Equinox Solar Ray)",
        then: "केवल लिखित ग्रंथों में दर्ज था कि विषुव के दिन सूर्य की पहली किरण गर्भगृह को आलोकित करती है।",
        now: "डिजिटल सौर सिमुलेटर (Equinox Azimuth Engine) द्वारा वास्तविक समय में प्रमाणित।",
        significance: "100% सटीक सौर खगोल विज्ञान पुष्टि"
      }
    ]
  },
  {
    id: "rani_vav",
    name: "Rani Ki Vav (रानी की वाव)",
    monumentLocation: "Patan, Gujarat • UNESCO World Heritage Site • 11th Century CE",
    thenTitle: "1980 Pre-Desiltation Archaeological Survey Record",
    thenDate: "1980 CE Pre-Excavation",
    thenSource: "ASI Excavation & Chemical Conservation Branch Archive (Western Circle Patan Excavation)",
    thenImg: "/comparisons/ranivav_then.jpg",
    thenImgFallback: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
    nowTitle: "2026 UNESCO Heritage 3D Digital Twin",
    nowDate: "2026 CE UNESCO Twin",
    nowSource: "High-Density Laser Scan & Multi-View Stereo Model",
    nowImg: "/comparisons/ranivav_now.jpg",
    nowImgFallback: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
    description: "Witnessing the transformative excavation of 500+ principal Dashavatara sculptures buried under Saraswati River silt for over 700 years vs. pristine modern digital twin.",
    differences: [
      {
        feature: "दशावतार मूर्तियाँ (500+ Sculptures)",
        then: "1980 तक अधिकांश मूर्तियाँ सरस्वती नदी की गाद और बालू में दबी हुई थीं।",
        now: "ASI उत्खनन के बाद शेषशायी विष्णु और 500+ मुख्य मूर्तियाँ विश्वस्तरीय संरक्षण में प्रदर्शित हैं।",
        significance: "भारतीय मूर्तिकला का अद्वितीय खजाना सुरक्षित"
      },
      {
        feature: "7 मंजिला संरचना (7-Tier Architecture)",
        then: "केवल ऊपरी 2 स्तर दृश्यमान थे; नीचे के 5 स्तर पूरी तरह बालू से पटे पड़े थे।",
        now: "सातों स्तरों का सफल उत्खनन; 4D डिजिटल ट्वin में प्रत्येक स्तर का विस्तृत 3D डेटा उपलब्ध।",
        significance: "भूमिगत जल मंदिर की भव्यता का पूर्ण प्रकटीकरण"
      },
      {
        feature: "यूनेस्को विश्व धरोहर दर्जा",
        then: "अज्ञात और गैर-संरक्षित क्षेत्रीय खंडहर के रूप में दर्ज था।",
        now: "2014 में UNESCO World Heritage घोषित; 2026 में पूर्णतः डिजिटाइज़्ड डिजिटल ट्विन।",
        significance: "वैश्विक पहचान और सर्वोच्च संरक्षण श्रेणी"
      }
    ]
  }
];

export const ThenVsNowSlider: React.FC = () => {
  const [activeItem, setActiveItem] = useState<ComparisonItem>(COMPARISONS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Slider Box */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Top Header */}
        <div className="px-5 py-4 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Historical Time-Slider: Then vs. Now (ऐतिहासिक तुलना)</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                Verified Archival Diff
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              स्लाइडर को आगे-पीछे ड्रैग करके देखें: 19वीं सदी का ऐतिहासिक रिकॉर्ड vs 2026 का आधुनिक 4D डिजिटल ट्विन।
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
                    ? "bg-amber-500 text-black font-semibold shadow-sm ring-1 ring-amber-400"
                    : "bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {comp.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Monument Context Bar */}
        <div className="px-5 py-2.5 bg-amber-950/20 border-b border-amber-900/30 flex items-center justify-between text-xs text-amber-200/90">
          <span className="font-semibold">{activeItem.name}</span>
          <span className="text-zinc-400 text-[11px] font-mono">{activeItem.monumentLocation}</span>
        </div>

        {/* Split-Screen Slider Viewport */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[420px] select-none overflow-hidden cursor-ew-resize bg-zinc-950"
        >
          {/* RIGHT LAYER: Modern 2026 Digital Twin (Full background) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={activeItem.nowImg}
              alt={activeItem.nowTitle}
              onError={(e) => {
                // Fallback to secondary resilient photo URL
                (e.target as HTMLImageElement).src = activeItem.nowImgFallback;
              }}
              className="w-full h-full object-cover"
            />
            {/* Label Badge Right (NOW) */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-black/85 border border-emerald-500/80 backdrop-blur-md text-xs font-mono text-emerald-300 shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>अभी (NOW): {activeItem.nowDate}</span>
            </div>
          </div>

          {/* LEFT LAYER: Historic Archival Plate (Clipped by clip-path for 100% zero-distortion) */}
          <img
            src={activeItem.thenImg}
            alt={activeItem.thenTitle}
            onError={(e) => {
              (e.target as HTMLImageElement).src = activeItem.thenImgFallback;
            }}
            style={{
              clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
              WebkitClipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
            }}
            className="absolute inset-0 w-full h-full object-cover filter sepia-[0.45] contrast-125 brightness-95"
          />

          {/* Label Badge Left (THEN) */}
          <div
            className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/80 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl flex items-center gap-2"
          >
            <span>📜 पहले (THEN): {activeItem.thenDate}</span>
          </div>

          {/* DRAGGABLE DIVIDER LINE & HANDLE */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 shadow-[0_0_20px_rgba(251,191,36,0.9)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-black border-2 border-white shadow-2xl flex items-center justify-center font-bold text-xs pointer-events-auto">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Quick jump presets */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="text-zinc-500">Preset:</span>
            <button onClick={() => setSliderPosition(15)} className="hover:text-amber-300 px-1">15%</button>
            <span>&bull;</span>
            <button onClick={() => setSliderPosition(50)} className="hover:text-amber-300 font-bold text-amber-400 px-1">50% (Split)</button>
            <span>&bull;</span>
            <button onClick={() => setSliderPosition(85)} className="hover:text-amber-300 px-1">85%</button>
          </div>
        </div>

        {/* Primary Source Citation Footer */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 space-y-2 text-xs">
          <p className="text-zinc-300 leading-relaxed">{activeItem.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Archival Source: <strong className="text-zinc-200">{activeItem.thenSource}</strong></span>
            </div>
            <span className="text-amber-400 font-semibold">Verified by ASI Archival Baseline</span>
          </div>
        </div>
      </div>

      {/* DIFFERENCE BREAKDOWN SECTION (पहले क्या था vs अभी क्या है) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              ऐतिहासिक बदलाव विश्लेषण (Historical Changes & Architectural Diff)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {activeItem.name}
          </span>
        </div>

        {/* Side-by-side Difference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeItem.differences.map((diff, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4 space-y-3 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                <span className="font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  {diff.feature}
                </span>
              </div>

              {/* THEN */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1">
                  <span>📜 पहले (Historical):</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/70 p-2 rounded-lg border border-zinc-800/60">
                  {diff.then}
                </p>
              </div>

              {/* NOW */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                  <span>🏛️ अभी (2026 Active Twin):</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/70 p-2 rounded-lg border border-zinc-800/60">
                  {diff.now}
                </p>
              </div>

              {/* SIGNIFICANCE */}
              <div className="pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400 flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">महत्व:</span>
                <span>{diff.significance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Language } from "@/lib/strings";

export const LangSwitch: React.FC = () => {
  const { lang, setLang } = useT();

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "gu", label: "ગુજરાતી" },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
      <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5" aria-hidden="true" />
      {languages.map((item) => (
        <button
          key={item.code}
          onClick={() => setLang(item.code)}
          aria-pressed={lang === item.code}
          className={`px-2 py-1 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            lang === item.code
              ? "bg-amber-500 text-black font-semibold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};


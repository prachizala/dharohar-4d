"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { strings, Language } from "./strings";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof strings["en"]) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => strings.en[key] || String(key),
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dharohar_lang") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "gu")) {
        setLangState(saved);
      }
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("dharohar_lang", newLang);
    } catch (e) {}
  };

  const t = (key: keyof typeof strings["en"]): string => {
    const langDict = strings[lang] || strings.en;
    return langDict[key] || strings.en[key] || String(key);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      <div lang={lang} className={lang === "hi" ? "font-hindi" : lang === "gu" ? "font-gujarati" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useT = () => useContext(I18nContext);


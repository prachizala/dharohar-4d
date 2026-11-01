import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dharohar 4D - Cultural Heritage Digital Archive & 3D Twins",
  description: "Centralised digital archive for Indian cultural heritage resources with verified historical claims, multilingual search, and honest 3D reconstructions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google model-viewer web component */}
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          async
        ></script>
      </head>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200 min-h-screen flex flex-col">
        <I18nProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
              <span>Dharohar 4D &bull; Free & Open-Access Heritage Platform</span>
              <span>All claims authenticated with primary source citations</span>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}

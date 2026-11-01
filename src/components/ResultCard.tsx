import React from "react";
import Link from "next/link";
import { Image as ImageIcon, FileText, Presentation, FileCode, Landmark, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface SearchItem {
  id: number;
  monument_id?: number;
  title: string;
  type: string;
  monument?: string;
  monument_hi?: string;
  monument_gu?: string;
  language?: string;
  verify_status: string;
  license?: string;
  snippet?: string;
  file_path?: string;
  original_name?: string;
  score?: number;
}

interface ResultCardProps {
  item: SearchItem;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "photo":
        return <ImageIcon className="w-5 h-5 text-amber-400" aria-hidden="true" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-400" aria-hidden="true" />;
      case "pptx":
      case "ppt":
        return <Presentation className="w-5 h-5 text-orange-400" aria-hidden="true" />;
      case "docx":
      case "doc":
        return <FileCode className="w-5 h-5 text-blue-400" aria-hidden="true" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-400" aria-hidden="true" />;
    }
  };

  return (
    <article className="group relative p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between gap-3 shadow-md focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950">
      <div className="space-y-2.5">
        {/* Header: Type icon, Monument, Status badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              {getTypeIcon(item.type)}
            </div>
            {item.monument && (
              <span className="text-xs font-medium text-amber-400/90 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                {item.monument}
              </span>
            )}
          </div>
          <StatusBadge status={item.verify_status} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-2">
          <Link
            href={`/resource/${item.id}`}
            className="focus:outline-none focus:underline"
          >
            {item.title}
          </Link>
        </h3>

        {/* Snippet */}
        {item.snippet && (
          <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
            {item.snippet}
          </p>
        )}
      </div>

      {/* Footer: Language, License & Action */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
            {item.language || "en"}
          </span>
          {item.license && (
            <span className="text-zinc-400">
              {item.license}
            </span>
          )}
        </div>

        <Link
          href={`/resource/${item.id}`}
          className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium text-xs"
          tabIndex={-1}
          aria-hidden="true"
        >
          View details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};


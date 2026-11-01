"use client";

import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className="relative p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col justify-between gap-3 shadow-md">
      {/* Shimmer gradient overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

      <div className="space-y-3">
        {/* Header: Icon square + monument name + status badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-750" />
            <div className="h-4 w-28 bg-zinc-800/80 rounded" />
          </div>
          <div className="h-5 w-20 bg-amber-950/40 border border-amber-900/40 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-1.5 pt-1">
          <div className="h-4 w-5/6 bg-zinc-800/90 rounded" />
          <div className="h-4 w-3/5 bg-zinc-800/60 rounded" />
        </div>

        {/* Snippet / Description */}
        <div className="space-y-1 pt-1">
          <div className="h-3 w-full bg-zinc-800/40 rounded" />
          <div className="h-3 w-4/5 bg-zinc-800/40 rounded" />
        </div>
      </div>

      {/* Footer metadata */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="h-4 w-24 bg-zinc-800/60 rounded" />
        <div className="h-4 w-16 bg-amber-500/20 rounded" />
      </div>
    </div>
  );
};

export const ArchiveGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="space-y-4 w-full">
      {/* Top summary bar skeleton */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
        <div className="h-4 w-44 bg-zinc-800/80 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-7 w-24 bg-zinc-800/60 rounded-lg animate-pulse" />
          <div className="h-7 w-24 bg-zinc-800/60 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Hero section skeleton */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="h-10 w-3/4 mx-auto bg-gradient-to-r from-zinc-800 via-amber-950/40 to-zinc-800 rounded-2xl" />
        <div className="h-4 w-2/3 mx-auto bg-zinc-800/60 rounded" />

        {/* Search bar skeleton */}
        <div className="h-14 max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
        </div>

        {/* Pills skeleton */}
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-24 bg-zinc-800/60 rounded-full" />
          ))}
        </div>
      </div>

      {/* Main Layout: Filters sidebar + Results */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-64 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 shrink-0">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-8 w-full bg-zinc-800/60 rounded-lg" />
            <div className="h-8 w-full bg-zinc-800/60 rounded-lg" />
            <div className="h-8 w-full bg-zinc-800/60 rounded-lg" />
            <div className="h-8 w-full bg-zinc-800/60 rounded-lg" />
          </div>
        </div>

        {/* Results grid skeleton */}
        <div className="flex-1 w-full">
          <ArchiveGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";

const SkeletonCard = () => (
  <div className="px-2 shrink-0 w-[70%] sm:w-[45%] md:w-[32%] lg:w-[26%] xl:w-[21%]">
    <div className="aspect-video rounded-3xl md:rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse border border-transparent shadow-xl" />
  </div>
);

export default function FeaturedNewestRowsSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-[#111111] py-1 overflow-hidden flex flex-col gap-6 relative transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-16 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
        </div>
        
        <div className="h-10 md:h-16 w-3/4 md:w-1/2 bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse mb-4" />
        
        <div className="space-y-2">
          <div className="h-4 w-full md:w-80 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
          <div className="h-4 w-2/3 md:w-60 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="w-[110%] -ml-[2%] flex overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={`s1-${i}`} />
          ))}
        </div>

        <div className="w-[115%] -ml-[8%] flex overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={`s2-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
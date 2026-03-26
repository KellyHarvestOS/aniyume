'use client';

import React from 'react';

export const ProfileSkeleton = () => {
  const barHeights = ["60%", "40%", "80%", "50%", "70%", "30%", "90%", "65%", "45%", "75%", "55%", "85%"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">

      <div className="lg:col-span-3 bg-white dark:bg-[#161616] rounded-lg p-6 shadow-sm border border-slate-100 dark:border-gray-800 text-center h-fit sticky top-24">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-slate-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800" />
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-slate-300 dark:bg-gray-600 border-4 border-white dark:border-black/70 rounded-full" />
        </div>

        <div className="h-7 bg-slate-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-2" />

        <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded-lg w-1/2 mx-auto mb-4" />

        <div className="space-y-2 mb-6 px-2">
          <div className="h-2 bg-slate-50 dark:bg-gray-800/50 rounded w-full" />
          <div className="h-2 bg-slate-50 dark:bg-gray-800/50 rounded w-5/6 mx-auto" />
        </div>

        <div className="grid grid-cols-2 gap-2 my-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 dark:bg-[#1a1a1a] p-2 rounded-lg border border-slate-100 dark:border-gray-800 h-14 flex flex-col items-center justify-center gap-1">
              <div className="h-4 bg-slate-200 dark:bg-gray-700 w-8 rounded" />
              <div className="h-2 bg-slate-100 dark:bg-gray-800 w-12 rounded" />
            </div>
          ))}
        </div>

        <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded-lg w-1/3 mx-auto mb-4" />

        <div className="w-full h-12 bg-slate-200 dark:bg-gray-700 rounded-xl mb-3" />

        <div className="w-full h-10 bg-slate-200 dark:bg-gray-700 rounded-xl mb-3" />

        <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-16 mx-auto mt-3" />
      </div>

      <div className="lg:col-span-9 space-y-6">
        <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full border-12 border-slate-100 dark:border-slate-800" />
            <div className="absolute flex flex-col items-center">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 w-10 rounded mb-1" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 w-16 rounded" />
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 w-28 rounded" />
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-6 rounded" />
              </div>
            ))}
          </div>

          <div className="w-full md:w-72 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-8">
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 w-32 rounded uppercase" />
              <div className="h-8 bg-slate-300 dark:bg-slate-600 w-44 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 w-40 rounded uppercase" />
              <div className="h-8 bg-slate-300 dark:bg-slate-600 w-20 rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 mb-6" />
          <div className="flex items-end gap-2 h-40 px-2">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mb-6" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-3/4 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
"use client";

import React from "react";

interface DynamicPoint {
  date: string;
  episodes_count: number;
}

export const WatchDynamics = ({
  dynamics,
}: {
  dynamics: DynamicPoint[];
}) => {
  const data = dynamics || [];
  const maxValue = Math.max(...data.map((d) => d.episodes_count), 1);

  return (
    <div className="bg-white dark:bg-[#161616] rounded-lg p-8 shadow-sm border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-black text-gray-800 dark:text-gray-200 text-lg tracking-tight">
            Динамика просмотров
          </h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
            За последние 10 дней
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
          <span className="text-brand text-xs font-black">
            Активность
          </span>
        </div>
      </div>

      <div className="relative h-48 flex items-end gap-1 sm:gap-2 pt-6">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-6 pb-6">
          <div className="border-t border-slate-300/40 dark:border-white/5 w-full" />
          <div className="border-t border-slate-300/40 dark:border-white/5 w-full" />
          <div className="border-t border-slate-300/40 dark:border-white/5 w-full" />
        </div>

        {data.map((d, i) => {
          const isActive = d.episodes_count > 0;
          const rawHeight = (d.episodes_count / maxValue) * 100;
          const height = isActive ? Math.max(rawHeight, 12) : 6;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end items-center group relative z-10 h-full"
            >
              {isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                  <div className="bg-gray-900 text-white text-[10px] font-black py-1 px-2 rounded-lg shadow-xl whitespace-nowrap relative">
                    {d.episodes_count} эп.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900" />
                  </div>
                </div>
              )}

              <div className="w-full relative h-full flex items-end justify-center">
                <div
                  style={{ height: `${height}%` }}
                  className={`w-full max-w-[42px] transition-all duration-500 ease-out ${isActive
                      ? "bg-linear-to-t from-[#2EC4B6] to-[#6EE7D8] rounded-t-lg shadow-sm group-hover:scale-x-105"
                      : "bg-slate-300/50 dark:bg-white/5 rounded-t-sm"
                    }`}
                />
              </div>

              <div className="mt-3 flex flex-col items-center shrink-0">
                <span
                  className={`text-[10px] font-black uppercase tracking-tighter ${isActive
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-slate-300 dark:text-gray-600"
                    }`}
                >
                  {new Date(d.date).getDate()}
                </span>
                <span className="text-[8px] text-slate-400 dark:text-gray-500 font-medium uppercase">
                  {new Date(d.date)
                    .toLocaleDateString("ru-RU", {
                      month: "short",
                    })
                    .replace(".", "")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { useI18n } from "@/contexts/I18nContext";

interface StatsOverviewProps {
  stats: {
    watching: number;
    planned: number;
    completed: number;
    on_hold: number;
    dropped: number;
  };
  watchTime: {
    days: number;
    hours: number;
    minutes: number;
    total_seconds: number;
  };
  historyCount: number;
}

export const StatsOverview = ({
  stats,
  watchTime,
  historyCount,
}: StatsOverviewProps) => {
  const { t } = useI18n();
  const { watching, planned, completed, on_hold, dropped } = stats;
  const total = watching + planned + completed + on_hold + dropped || 0;

  const calculatePercent = (val: number) =>
    total > 0 ? (val / total) * 100 : 0;

  const p1 = calculatePercent(watching);
  const p2 = p1 + calculatePercent(planned);
  const p3 = p2 + calculatePercent(completed);
  const p4 = p3 + calculatePercent(on_hold);

  const pieChartStyle = {
    background:
      total > 0
        ? `conic-gradient(
            #22c55e 0% ${p1}%,
            #a855f7 ${p1}% ${p2}%,
            #3b82f6 ${p2}% ${p3}%,
            #eab308 ${p3}% ${p4}%,
            #ef4444 ${p4}% 100%
          )`
        : "#e5e7eb",
  };

  return (

    <div className="bg-white dark:bg-[#161616] rounded-xl p-5 md:p-8 shadow-sm border border-slate-200 dark:border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-8 transition-colors">
      

      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
        <div
          className="relative w-36 h-36 md:w-40 md:h-40 rounded-full shrink-0 shadow-inner"
          style={pieChartStyle}
        >
          <div className="absolute inset-2 bg-white dark:bg-[#111111] rounded-full flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-gray-800 dark:text-gray-200">
              {total}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-wider">
              {t('stats.titles')}
            </span>
          </div>
        </div>

        <div className="space-y-2 w-full flex-1">
          <StatRow label={t('stats.watching')} count={watching} color="bg-green-500" />
          <StatRow label={t('stats.planned')} count={planned} color="bg-purple-500" />
          <StatRow label={t('stats.completed')} count={completed} color="bg-blue-500" />
          <StatRow label={t('stats.onHold')} count={on_hold} color="bg-yellow-500" />
          <StatRow label={t('stats.dropped')} count={dropped} color="bg-red-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col justify-center gap-6 bg-slate-50 dark:bg-white/3 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
        <div>
          <p className="text-slate-500 dark:text-gray-500 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-tight">
            {t('stats.timeSpent')}
          </p>
          <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-200 wrap-break-word">
            {t('stats.dhm', { d: watchTime.days, h: watchTime.hours, m: watchTime.minutes })}
          </p>
        </div>

        <div className="sm:border-l sm:pl-6 lg:border-l-0 lg:pl-0 lg:mt-0">
          <p className="text-slate-500 dark:text-gray-500 text-[10px] md:text-xs uppercase font-bold mb-1 tracking-tight">
            {t('stats.episodesWatched')}
          </p>
          <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-200">
            {historyCount}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div className="flex items-center gap-3 text-sm py-0.5">
    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
    <span className="flex-1 text-slate-600 dark:text-gray-400 font-medium">
      {label}
    </span>
    <span className="font-bold text-gray-800 dark:text-gray-200 tabular-nums">
      {count}
    </span>
  </div>
);
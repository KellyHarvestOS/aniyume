"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ActivityItem {
  anime_id: number;
  title: string;
  poster_url: string;
  episodes_watched: number;
  episode_number?: number;
  last_watched_at: string;
}

export const RecentActivity = ({
  activity,
}: {
  activity: ActivityItem[];
}) => {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return "Сегодня";

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="bg-white dark:bg-[#161616] rounded-lx p-6 shadow-sm border border-slate-200 dark:border-white/5 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-800 dark:text-gray-200">
          Недавние активности
        </h2>
        <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">
          Последние 10 дней
        </span>
      </div>

      <div className="space-y-3">
        {activity && activity.length > 0 ? (
          activity.map((item, idx) => (
            <div
              key={idx}
              onClick={() => router.push(`/anime/${item.anime_id}`)}
              className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition
                         bg-transparent
                         hover:bg-slate-100 dark:hover:bg-white/5
                         border border-transparent
                         hover:border-slate-300 dark:hover:border-white/10
                         group"
            >
              <div className="relative shrink-0">
                <img
                  src={item.poster_url || "/placeholder.jpg"}
                  alt="poster"
                  className="w-12 h-16 object-cover rounded-xl shadow-sm
                             border border-slate-200 dark:border-white/10"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-[#2EC4B6] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Серия {item.episode_number ?? 1}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400 dark:text-gray-500 font-bold whitespace-nowrap">
                  {formatDate(item.last_watched_at)}
                </p>
                <p className="text-[10px] text-slate-300 dark:text-gray-600 font-medium uppercase mt-0.5">
                  {(() => {
                    const d = new Date(item.last_watched_at);
                    d.setHours(d.getHours() + 5);
                    return d.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  })()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-100 dark:bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-slate-400 dark:text-gray-500">⏳</span>
            </div>
            <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">
              История просмотров пуста
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

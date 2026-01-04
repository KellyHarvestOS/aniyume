'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaChevronRight } from 'react-icons/fa';

interface AnimeItem {
  id: number;
  title: string;
  poster_url: string;
  year?: number;
  episodes_count?: number;
}

const DAYS_INFO = [
  { full: 'Понедельник', short: 'Пн' },
  { full: 'Вторник', short: 'Вт' },
  { full: 'Среда', short: 'Ср' },
  { full: 'Четверг', short: 'Чт' },
  { full: 'Пятница', short: 'Пт' },
  { full: 'Суббота', short: 'Сб' },
  { full: 'Воскресенье', short: 'Вс' }
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Record<number, AnimeItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [todayIndex, setTodayIndex] = useState(0);

  const API_BASE = '/api/external';

  useEffect(() => {
    const jsDay = new Date().getDay();
    setTodayIndex(jsDay === 0 ? 6 : jsDay - 1);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/anime?status=ongoing&per_page=60&sort=popularity`);
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        const list: AnimeItem[] = Array.isArray(json.data) ? json.data : [];

        const grouped: Record<number, AnimeItem[]> = {};
        DAYS_INFO.forEach((_, index) => {
          grouped[index] = [];
        });

        list.forEach(anime => {
          const dayIndex = anime.id % 7;
          grouped[dayIndex].push(anime);
        });

        setSchedule(grouped);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToDay = (index: number) => {
    const element = document.getElementById(`day-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#111111] pb-20 relative transition-colors">
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md p-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-800">
        {DAYS_INFO.map((day, index) => {
          const isToday = index === todayIndex;
          return (
            <button
              key={index}
              onClick={() => scrollToDay(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative group ${
                isToday
                  ? 'bg-[#21D0B8] text-white shadow-[0_0_15px_#21D0B8] scale-110'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-[#21D0B8] hover:text-white'
              }`}
            >
              {day.short}
              <span className="absolute right-12 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {day.full}
              </span>
              {isToday && (
                <span className="absolute inset-0 rounded-full bg-[#21D0B8] animate-ping opacity-30"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-6 flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-200 tracking-tight">
            Расписание новых серий
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 space-y-16">
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(k => (
                    <div key={k} className="aspect-2/3 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          DAYS_INFO.map((day, index) => {
            const animeForDay = schedule[index] || [];
            if (animeForDay.length === 0) return null;

            const isToday = index === todayIndex;

            return (
              <div
                key={index}
                id={`day-${index}`}
                className={`rounded-3xl transition-all duration-500 ${
                  isToday
                    ? 'bg-white dark:bg-[#0d0d0d] p-8 shadow-[0_10px_40px_-10px_rgba(33,208,184,0.15)] border border-[#21D0B8]/40 relative overflow-hidden'
                    : 'p-2'
                }`}
              >
                {isToday && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#21D0B8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                )}

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <h2 className={`text-3xl font-bold tracking-tight ${
                    isToday ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {day.full}
                  </h2>
                  {isToday && (
                    <span className="bg-[#21D0B8] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#21D0B8]/40 animate-pulse">
                      Сегодня выходит
                    </span>
                  )}
                  {!isToday && <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4"></div>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
                  {animeForDay.map(anime => (
                    <Link
                      href={`/anime/${anime.id}`}
                      key={anime.id}
                      className="group flex flex-col gap-3"
                    >
                      <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden bg-gray-900 shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                        <Image
                          src={anime.poster_url || '/placeholder.jpg'}
                          alt={anime.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                          {anime.id % 24 + 1} серия
                        </div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="w-12 h-12 bg-[#21D0B8] rounded-full flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                            <FaPlay className="ml-1" size={14} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1 group-hover:text-[#21D0B8] transition-colors">
                          {anime.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400 mt-1 gap-1">
                          <span>Новая серия</span>
                          <FaChevronRight size={10} className="text-[#21D0B8]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay, FaEllipsisV } from 'react-icons/fa';

interface AnimeItem {
  id: number;
  title: string;
  poster_url: string;
  rating: string;
  description?: string;
  year?: number;
  type?: string;
  episodes_count?: number;
}

const TABS = [
  { id: 'ongoing', label: 'Онгоинги', query: 'status=ongoing&sort=popularity' },
  { id: 'finished', label: 'Завершенные', query: 'status=finished&sort=popularity' },
  { id: 'movies', label: 'Фильмы', query: 'type=movie&sort=popularity' },
  { id: 'ova', label: 'OVA', query: 'type=ova&sort=popularity' }
];

export default function PopularPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = '/api/external';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const currentTab = TABS.find(t => t.id === activeTab);
        const queryParams = currentTab ? currentTab.query : TABS[0].query;
        const res = await fetch(`${API_BASE}/anime?${queryParams}&per_page=30&page=1`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setAnimeList(Array.isArray(data.data) ? data.data : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] pb-20 transition-colors">
      <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 pt-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 mb-6">
            Популярное
          </h1>

          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'border-[#21D0B8] text-[#21D0B8]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex p-6 gap-6 items-center animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-[110px] h-[165px] md:w-40 md:h-60 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {animeList.map((anime, index) => (
                <Link
                  href={`/anime/${anime.id}`}
                  key={anime.id}
                  className="group flex flex-col md:flex-row items-start md:items-center p-6 gap-6 hover:bg-[#21D0B8]/5 dark:hover:bg-[#21D0B8]/10 transition-colors relative"
                >
                  <div className={`hidden md:flex shrink-0 w-12 text-3xl font-black italic ${
                    index < 3 ? 'text-[#21D0B8]' : 'text-gray-300 dark:text-gray-600'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="relative w-[110px] h-[165px] md:w-40 md:h-60 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                    <Image
                      src={anime.poster_url || '/placeholder.jpg'}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 group-hover:text-[#21D0B8] transition-colors line-clamp-1">
                        {anime.title}
                      </h3>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                        <FaEllipsisV />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <span>
                        {anime.type || 'TV'} • {anime.year}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-400/20">
                        <FaStar className="text-xs" /> {anime.rating}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed hidden md:block">
                      {anime.description
                        ? anime.description.replace(/<[^>]*>?/gm, '')
                        : 'Описание отсутствует.'}
                    </p>
                  </div>

                  <div className="hidden md:flex shrink-0 self-center">
                    <button className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-300 flex items-center justify-center group-hover:bg-[#21D0B8] group-hover:border-[#21D0B8] group-hover:text-white transition-all">
                      <FaPlay className="pl-1" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {!isLoading && animeList.length > 0 && (
          <div className="text-center mt-8 text-gray-400 dark:text-gray-500 text-sm">
            Показано топ-20 аниме
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookmarksSkeleton from "@/components/skeletons/BookmarksSkeleton";
import {
  FaHeart,
  FaEye,
  FaCalendarCheck,
  FaCheckCircle,
  FaPause,
  FaTrash,
  FaSearch,
  FaStar,
} from "react-icons/fa";

interface AnimeItem {
  id: number | string;
  title: string;
  title_russian?: string;
  image?: string;
  poster_url?: string;
  user_rating?: number | null;
}

const TABS = [
  { id: "favorites", label: "Избранное", icon: <FaHeart /> },
  { id: "watching", label: "Смотрю", icon: <FaEye /> },
  { id: "planned", label: "В планах", icon: <FaCalendarCheck /> },
  { id: "completed", label: "Просмотрено", icon: <FaCheckCircle /> },
  { id: "on_hold", label: "Отложено", icon: <FaPause /> },
  { id: "dropped", label: "Брошено", icon: <FaTrash /> },
];

export default function BookmarksPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("favorites");
  const [isLoading, setIsLoading] = useState(true);
  const [allLists, setAllLists] = useState<{ [key: string]: AnimeItem[] }>({
    favorites: [],
    watching: [],
    planned: [],
    completed: [],
    on_hold: [],
    dropped: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthorized(true);
    fetchAllData(token);
  }, [router]);

  const fetchAllData = async (token: string) => {
    setIsLoading(true);
    const API_BASE = "/api/external";
    const headers = { Authorization: `Bearer ${token}` };

    const fetchList = async (url: string) => {
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) return [];
        const json = await res.json();
        const data = json.data || json;
        if (!Array.isArray(data)) return [];
        return data.map((item: any) => ({
          ...(item.anime || item),
          id: item.anime_id || item.anime?.id || item.id,
          user_rating: item.rating || item.anime?.rating || null,
        }));
      } catch {
        return [];
      }
    };

    const [favorites, watching, planned, completed, onHold, dropped] =
      await Promise.all([
        fetchList(`${API_BASE}/favorites`),
        fetchList(`${API_BASE}/my-anime-list/watching`),
        fetchList(`${API_BASE}/my-anime-list/planned`),
        fetchList(`${API_BASE}/my-anime-list/completed`),
        fetchList(`${API_BASE}/my-anime-list/on_hold`),
        fetchList(`${API_BASE}/my-anime-list/dropped`),
      ]);

    setAllLists({ favorites, watching, planned, completed, on_hold: onHold, dropped });
    setIsLoading(false);
  };

  const handleRemove = async (e: React.MouseEvent, animeId: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setAllLists((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((a) => a.id !== animeId),
    }));

    try {
      const url = activeTab === "favorites"
          ? `/api/external/favorites/${animeId}`
          : `/api/external/my-anime-list/${animeId}`;

      await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const currentItems = allLists[activeTab] || [];

  if (!isAuthorized) return null;

  if (isLoading) return <BookmarksSkeleton />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-gray-900 dark:text-white transition-colors">
      <div className="bg-white/90 dark:bg-[#111111]/90 border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6 pt-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-gray-900 dark:text-white">
            Мои <span className="text-[#21D0B8]">Списки</span>
          </h1>

          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-[#21D0B8] text-[#21D0B8]"
                    : "border-transparent text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className="text-[10px] opacity-40">
                  {allLists[tab.id]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {currentItems.length === 0 ? (
          <div className="text-center py-40">
            <FaSearch className="mx-auto text-gray-200 dark:text-white/5 text-8xl mb-6" />
            <h2 className="text-2xl font-black text-gray-400 dark:text-white/20 uppercase italic">
              Здесь ничего не найдено
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentItems.map((anime) => (
              <div
                key={`${activeTab}-${anime.id}`}
                className="group relative bg-gray-50 dark:bg-[#121212] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-[#21D0B8]/50 transition-all shadow-sm"
              >
                <div className="relative aspect-2/3 overflow-hidden">
                  <Link href={`/anime/${anime.id}`}>
                    <img
                      src={anime.poster_url || anime.image || "/no-poster.png"}
                      alt={anime.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {anime.user_rating && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 shadow-sm">
                      <FaStar className="text-yellow-500 dark:text-yellow-400 text-[10px]" />
                      <span className="text-[10px] font-black text-gray-900 dark:text-white">
                        {anime.user_rating}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={(e) => handleRemove(e, anime.id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-black/60 hover:bg-red-500 dark:hover:bg-red-500 backdrop-blur-md rounded-lg text-gray-600 dark:text-white opacity-0 group-hover:opacity-100 transition-all shadow-md hover:text-white"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-[11px] leading-tight uppercase tracking-tight line-clamp-2 text-gray-800 dark:text-gray-200 group-hover:text-[#21D0B8] transition-colors">
                    {anime.title_russian || anime.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
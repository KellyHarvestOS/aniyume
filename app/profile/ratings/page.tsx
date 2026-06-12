"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar, FaChevronLeft, FaTrashAlt, FaPlay } from "react-icons/fa";
import RatingCardSkeleton from "@/components/skeletons/RatingCardSkeleton";
import { useI18n } from "@/contexts/I18nContext";

interface RatedAnime {
  id: number;
  rating: number;
  created_at: string;
  anime: {
    id: number;
    title: string;
    poster_url: string;
  };
}

export default function RatingsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [ratings, setRatings] = useState<RatedAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [router]);

  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return router.push("/login");

      const res = await fetch("/api/external/ratings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        setRatings(json.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("ratings.confirmDelete"))) return;

    setRatings((prev) => prev.filter((item) => item.id !== id));

    const token = localStorage.getItem("userToken");
    await fetch(`/api/external/ratings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111]">
        <main className="max-w-[1920px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <RatingCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#111111] dark:text-white">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111111]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-brand rounded-full transition-all group"
          >
            <FaChevronLeft className="group-hover:scale-110 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              {t("ratings.title1")} <span className="text-brand w-[7rem]">{t("ratings.title2")}</span>
            </h1>
            <p className="text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em]">
              {t("ratings.total", { n: ratings.length })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {ratings.length === 0 ? (
          <div className="py-40 text-center">
            <h2 className="text-4xl font-black text-black/10 dark:text-white/10 uppercase italic">
              {t("ratings.empty")}
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {ratings.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-[#161616] rounded-xl overflow-hidden border border-black/5 dark:border-white/5 hover:border-[#2EC4B6]/50 transition-all"
              >
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-500 backdrop-blur-md rounded-lg text-white/70 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <FaTrashAlt size={12} />
                </button>

                <div className="relative aspect-3/4 overflow-hidden">
                  <img
                    src={item.anime.poster_url}
                    alt={item.anime.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link
                      href={`/anime/${item.anime.id}`}
                      className="w-12 h-12 flex items-center justify-center bg-brand rounded-full text-white dark:text-black scale-0 group-hover:scale-100 transition-transform"
                    >
                      <FaPlay size={16} className="ml-1" />
                    </Link>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-black/85 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-lg">
                    <FaStar className="text-yellow-400" size={16} />
                    <span className="text-sm font-black text-black dark:text-white">{item.rating}</span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-[11px] font-black uppercase truncate mb-1 group-hover:text-brand transition-colors">
                    {item.anime.title}
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-[8px] font-bold text-black/40 dark:text-white/30 uppercase">
                      {formatDate(item.created_at)}
                    </span>
                    <Link
                      href={`/anime/${item.anime.id}#player`}
                      className="text-[8px] font-black text-brand uppercase hover:underline"
                    >
                      {t("common.edit")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

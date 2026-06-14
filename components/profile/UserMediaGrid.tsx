"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaLock, FaStar } from "react-icons/fa";

type Visibility = "visible" | "hidden";

type Item = {
  anime_id: number;
  title: string;
  poster_url: string | null;
  rating?: number | string | null;
};

type Props = {
  userId: string | number;
  kind: "favorites" | "ratings";
  visibility: Visibility;
  title: string;
};

type RawFavorite = { anime_id: number; title?: string; poster_url?: string | null };
type RawRating = {
  anime_id?: number;
  rating?: number | string | null;
  anime?: { id: number; title?: string; poster_url?: string | null };
};

// Приводим ответы /users/{id}/favorites и /users/{id}/ratings к единой форме.
function normalize(kind: Props["kind"], raw: unknown[]): Item[] {
  if (kind === "ratings") {
    return (raw as RawRating[]).map((r) => ({
      anime_id: r.anime?.id ?? r.anime_id ?? 0,
      title: r.anime?.title ?? "",
      poster_url: r.anime?.poster_url ?? null,
      rating: r.rating,
    }));
  }
  return (raw as RawFavorite[]).map((f) => ({
    anime_id: f.anime_id,
    title: f.title ?? "",
    poster_url: f.poster_url ?? null,
  }));
}

export default function UserMediaGrid({ userId, kind, visibility, title }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(visibility === "visible");

  useEffect(() => {
    if (visibility !== "visible") return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`/api/external/users/${userId}/${kind}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!res.ok) {
          if (!cancelled) setItems([]);
          return;
        }
        const data = await res.json();
        if (!cancelled) setItems(normalize(kind, Array.isArray(data.data) ? data.data : []));
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, kind, visibility]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-[#161616]">
      <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">{title}</p>

      {visibility === "hidden" ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <FaLock className="text-2xl text-slate-300 dark:text-white/10" />
          <p className="text-sm font-bold text-slate-400 dark:text-white/30">Скрыто настройками приватности</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-2/3 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <p className="py-8 text-center text-sm font-bold text-slate-400 dark:text-white/30">Пока пусто</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {items.map((item) => (
            <Link
              key={`${item.anime_id}`}
              href={`/anime/${item.anime_id}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-brand dark:border-white/5 dark:bg-[#121212]"
            >
              <div className="relative aspect-2/3 overflow-hidden">
                <img
                  src={item.poster_url || "/no-poster.png"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.rating != null && (
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md border border-gray-200 bg-white/90 px-2 py-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/80">
                    <FaStar className="text-[10px] text-yellow-500 dark:text-yellow-400" />
                    <span className="text-[10px] font-black text-gray-900 dark:text-white">{item.rating}</span>
                  </div>
                )}
              </div>
              <p className="truncate px-2 py-2 text-[11px] font-bold text-slate-700 dark:text-white/70">{item.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

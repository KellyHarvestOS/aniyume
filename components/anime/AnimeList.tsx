'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimeCardSkeleton from '@/components/skeletons/AnimeCardSkeleton';
import AnimeCard from '@/components/anime/AnimeCard';

interface AnimeData {
  id: number;
  title: string;
  poster_url: string;
  rating: string;
  year?: number;
  type?: string;
}

const CACHE_KEY_PREFIX = 'aniyume_animelist_page_';
const CACHE_DURATION = 1000 * 60 * 15;

const normalizeAnimeData = (value: unknown): AnimeData[] => Array.isArray(value) ? value : [];

const readCachedPage = (page: number) => {
  const cacheKey = `${CACHE_KEY_PREFIX}${page}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    const items = normalizeAnimeData(parsed.data);
    if (items.length === 0) return null;

    return {
      items,
      total: Number(parsed.total) || page,
      isFresh: Date.now() - Number(parsed.timestamp || 0) < CACHE_DURATION,
    };
  } catch {
    sessionStorage.removeItem(cacheKey);
    return null;
  }
};

const AnimeList = ({ title }: { title: string }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAnime = async () => {
      const cacheKey = `${CACHE_KEY_PREFIX}${page}`;
      const cached = readCachedPage(page);

      if (cached) {
        if (!cancelled) {
          setData((current) => page === 1 ? cached.items : [...current, ...cached.items]);
          setTotal(cached.total);
          setLoading(false);
          setLoadingMore(false);
        }

        if (cached.isFresh) return;
      }

      if (!cached) {
        const cachedPages: AnimeData[] = [];
        let cachedTotal = 1;

        for (let pageNumber = 1; pageNumber <= 100; pageNumber++) {
          const cachedPage = readCachedPage(pageNumber);
          if (!cachedPage) break;
          cachedPages.push(...cachedPage.items);
          cachedTotal = Math.max(cachedTotal, cachedPage.total);
        }

        if (page === 1 && cachedPages.length > 0 && !cancelled) {
          setData(cachedPages);
          setPage(Math.ceil(cachedPages.length / 10));
          setTotal(cachedTotal);
          setLoading(false);
          setLoadingMore(false);
        }
      }

      if (!navigator.onLine && cached) return;

      try {
        if (!cached) {
          if (page === 1) {
            setLoading(true);
          } else {
            setLoadingMore(true);
          }
        }

        const res = await fetch(`/api/external/anime?page=${page}&sort=newest&per_page=10`);
        const json = await res.json();

        const newData = normalizeAnimeData(json.data || json);
        const newTotal = json.meta?.last_page || json.last_page || 10;

        if (newData.length === 0) return;

        if (!cancelled) {
          setData((current) => page === 1 ? newData : [...current, ...newData]);
          setTotal(newTotal);
        }

        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: newData,
          total: newTotal,
          timestamp: Date.now()
        }));

      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };
    fetchAnime();

    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || page >= total) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((current) => current >= total ? current : current + 1);
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loading, loadingMore, page, total]);

  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <div className="border-t-2 border-slate-100 pt-10 dark:border-zinc-800 mb-10" />
      <div ref={titleRef} className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-6xl font-black text-gray-800 dark:text-gray-100 tracking-tighter uppercase">{title}</h2>
        <div className="w-24 sm:w-48 h-1.5 bg-brand rounded-full mt-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 justify-items-center">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : Array.isArray(data) ? data.map(item => <AnimeCard key={item.id} {...item} />) : null
        }
      </div>

      <div ref={loadMoreRef} className="mt-12 min-h-20">
        {loadingMore && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 justify-items-center">
            {Array.from({ length: 5 }).map((_, i) => <AnimeCardSkeleton key={`more-${i}`} />)}
          </div>
        )}

        {!loading && page >= total && data.length > 0 && (
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
            Все аниме загружены
          </p>
        )}
      </div>
    </section>
  );
};

export default AnimeList;

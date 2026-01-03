'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

const AnimeList = ({ title }: { title: string }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      const cacheKey = `${CACHE_KEY_PREFIX}${page}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        const { data: cachedData, total: cachedTotal, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setData(cachedData);
          setTotal(cachedTotal);
          setLoading(false);
          if (page > 1) titleRef.current?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      try {
        setLoading(true);
        if (page > 1) titleRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        const res = await fetch(`/api/external/anime?page=${page}&sort=newest&per_page=10`);
        const json = await res.json();
        
        const newData = json.data || json;
        const newTotal = json.meta?.last_page || json.last_page || 10;

        setData(newData);
        setTotal(newTotal);

        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: newData,
          total: newTotal,
          timestamp: Date.now()
        }));

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [page]);

  const renderPages = () => {
    const nums = [];
    const pushBtn = (p: number) => nums.push(
      <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === p ? "bg-[#21D0B8] text-white shadow-lg scale-110" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"}`}>{p}</button>
    );

    pushBtn(1);
    if (page > 3) nums.push(<span key="l" className="px-1 text-gray-400">...</span>);
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pushBtn(i);
    if (page < total - 2) nums.push(<span key="r" className="px-1 text-gray-400">...</span>);
    if (total > 1) pushBtn(total);
    return nums;
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <div className="border-t-2 border-slate-100 pt-10 dark:border-zinc-800 mb-10" />
      <div ref={titleRef} className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-6xl font-black text-gray-800 dark:text-gray-100 tracking-tighter uppercase">{title}</h2>
        <div className="w-24 sm:w-48 h-1.5 bg-[#21D0B8] rounded-full mt-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 justify-items-center">
        {loading 
          ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : data.map(item => <AnimeCard key={item.id} {...item} />)
        }
      </div>

      {!loading && data.length > 0 && (
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 disabled:opacity-20 dark:text-gray-300"><FaChevronLeft /></button>
            <div className="hidden sm:flex gap-1">{renderPages()}</div>
            <div className="sm:hidden px-4 font-black text-sm dark:text-gray-300">{page} / {total}</div>
            <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total} className="p-3 disabled:opacity-20 dark:text-gray-300"><FaChevronRight /></button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnimeList;
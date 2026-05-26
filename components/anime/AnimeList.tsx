'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronDown } from 'react-icons/fa';
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

interface AnimeListProps {
  title: string;
  filters?: {
    search?: string;
    genre?: string;
    year?: string;
    type?: string;
    sort?: string;
  };
}

const AnimeList: React.FC<AnimeListProps> = ({ title, filters = {} }) => {
  const [data, setData] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. Initial Load & Reset on Filters Change
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setPage(1);
      
      try {
        const params = new URLSearchParams({
          page: '1',
          per_page: '20',
          sort: filters.sort || 'smart',
          ...Object.fromEntries(Object.entries(filters).filter(([k, v]) => !!v && k !== 'sort'))
        });

        const res = await fetch(`/api/external/public/anime?${params.toString()}`);
        const json = await res.json();
        const raw = json.data || [];
        
        setData(raw);
        setHasMore(raw.length >= 20);
      } catch (e) {
        console.error('Initial fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [filters.search, filters.genre, filters.year, filters.type, filters.sort]);

  // 2. Load Next Page
  const fetchNextPage = useCallback(async () => {
    if (loadingNext || !hasMore) return;
    
    setLoadingNext(true);
    const nextPage = page + 1;
    
    try {
      const params = new URLSearchParams({
        page: nextPage.toString(),
        per_page: '20',
        sort: filters.sort || 'smart',
        ...Object.fromEntries(Object.entries(filters).filter(([k, v]) => !!v && k !== 'sort'))
      });

      const res = await fetch(`/api/external/public/anime?${params.toString()}`);
      const json = await res.json();
      const raw = json.data || [];
      
      if (raw.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...raw]);
        setPage(nextPage);
        setHasMore(raw.length >= 20);
      }
    } catch (e) {
      console.error('Next page fetch failed:', e);
    } finally {
      setLoadingNext(false);
    }
  }, [page, hasMore, loadingNext, filters]);

  // 3. Intersection Observer Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingNext) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasMore, loading, loadingNext]);

  // 4. Scroll to Top logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-10 relative">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-6xl font-black text-gray-800 dark:text-gray-100 tracking-tighter uppercase italic">{title}</h2>
        <div className="w-24 sm:w-48 h-1.5 bg-brand rounded-full mt-3 shadow-lg shadow-brand/20" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 justify-items-center">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : data.map(item => <AnimeCard key={`${item.id}-${Math.random()}`} {...item} />)
        }
      </div>

      {/* Loading indicator for next pages */}
      <div ref={observerTarget} className="w-full flex justify-center py-16">
        {loadingNext && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 animate-pulse">Загружаем ещё...</span>
          </div>
        )}
        {!hasMore && data.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />
            <span className="text-sm font-bold text-gray-500 italic">На этом всё! :)</span>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400">Ничего не найдено по вашему запросу</h3>
            <p className="text-sm text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-brand text-white rounded-2xl shadow-2xl flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 z-[60] group"
        >
          <div className="absolute inset-0 bg-brand rounded-2xl animate-ping opacity-20 group-hover:opacity-40" />
          <FaChevronDown className="rotate-180" />
        </button>
      )}
    </section>
  );
};

export default AnimeList;
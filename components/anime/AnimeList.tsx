'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import AnimeCardSkeleton from '@/components/skeletons/AnimeCardSkeleton';
import AnimeCard from '@/components/anime/AnimeCard';
import { useI18n } from '@/contexts/I18nContext';

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

const PER_PAGE = 20;

const normalizeAnimeData = (value: unknown): AnimeData[] => Array.isArray(value) ? value : [];

const buildParams = (page: number, filters: AnimeListProps['filters'] = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: PER_PAGE.toString(),
    sort: filters.sort || 'smart',
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value && key !== 'sort') params.set(key, value);
  });

  return params;
};

const AnimeList: React.FC<AnimeListProps> = ({ title, filters = {} }) => {
  const { t } = useI18n();
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const [data, setData] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const stableFilters = JSON.parse(filterKey) as AnimeListProps['filters'];

    const fetchInitial = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);

      try {
        const params = buildParams(1, stableFilters);
        const res = await fetch(`/api/external/public/anime?${params.toString()}`);
        if (!res.ok) throw new Error(`Anime fetch failed with status ${res.status}`);
        const json = await res.json();
        const items = normalizeAnimeData(json.data || json);

        if (cancelled) return;

        setData(items);
        setHasMore(items.length >= PER_PAGE);
      } catch (e) {
        console.error('Initial fetch failed:', e);
        if (!cancelled) {
          setData([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();

    return () => {
      cancelled = true;
    };
  }, [filterKey]);

  const fetchNextPage = useCallback(async () => {
    if (loadingNext || loading || !hasMore) return;

    setLoadingNext(true);
    const nextPage = page + 1;

    try {
      const stableFilters = JSON.parse(filterKey) as AnimeListProps['filters'];
      const params = buildParams(nextPage, stableFilters);
      const res = await fetch(`/api/external/public/anime?${params.toString()}`);
      if (!res.ok) throw new Error(`Anime fetch failed with status ${res.status}`);
      const json = await res.json();
      const items = normalizeAnimeData(json.data || json);

      if (items.length === 0) {
        setHasMore(false);
        return;
      }

      setData((current) => [...current, ...items]);
      setPage(nextPage);
      setHasMore(items.length >= PER_PAGE);
    } catch (e) {
      console.error('Next page fetch failed:', e);
    } finally {
      setLoadingNext(false);
    }
  }, [filterKey, hasMore, loading, loadingNext, page]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage]);

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
          ? Array.from({ length: PER_PAGE }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : data.map((item) => <AnimeCard key={item.id} {...item} />)
        }
      </div>

      <div ref={observerTarget} className="w-full flex justify-center py-16">
        {loadingNext && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 animate-pulse">{t('list.loadingMore')}</span>
          </div>
        )}
        {!hasMore && data.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />
            <span className="text-sm font-bold text-gray-500 italic">{t('list.end')}</span>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400">{t('list.notFound')}</h3>
            <p className="text-sm text-gray-500 mt-2">{t('list.tryFilters')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimeList;

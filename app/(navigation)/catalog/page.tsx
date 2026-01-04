'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay, FaArrowLeft, FaFilter, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface AnimeData {
  id: number;
  title: string;
  poster_url: string;
  rating: string;
  description?: string;
  year?: number;
  type?: string;
  genres?: { name: string }[] | string[];
}

const FILTER_LABELS: Record<string, string> = {
  genre: 'Жанр',
  year: 'Год',
  status: 'Статус',
  type: 'Тип',
  translator: 'Озвучка',
  sort: 'Сортировка',
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [animeData, setAnimeData] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = '/api/external';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchFilteredAnime = async () => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const params = new URLSearchParams(searchParams.toString());
        if (!params.has('page')) params.set('page', '1');
        if (!params.has('per_page')) params.set('per_page', '20');

        const res = await fetch(`${API_BASE}/anime?${params.toString()}`);
        if (!res.ok) throw new Error('Ошибка API');
        const data = await res.json();
        
        const list = Array.isArray(data.data) ? data.data : [];
        setAnimeData(list);
        setTotalItems(data.meta?.total || list.length);
        setTotalPages(data.meta?.last_page || data.last_page || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredAnime();
  }, [searchParams]);

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', '1');
    router.push(`/catalog?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/catalog?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(totalPages, 5);
    if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button key={i} onClick={() => handlePageChange(i)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${currentPage === i ? "bg-[#21D0B8] text-white shadow-lg shadow-teal-200 scale-110" : "text-gray-600 hover:bg-gray-100 hover:text-[#21D0B8]"}`}>{i}</button>
        );
    }
    return pages;
  };

  const activeFilters = Array.from(searchParams.entries()).filter(
    ([key]) => key !== 'page' && key !== 'per_page' && key !== 'sort'
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-[#111111] transition-colors ">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm dark:bg-[#111111] dark:border-gray-800 ">
        <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-800 transition dark:text-gray-200"><FaArrowLeft size={20} /></button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Каталог</h1>
                <p className="text-xs text-gray-500">{isLoading ? 'Загрузка...' : `Найдено: ${totalItems}`}</p>
            </div>
          </div>
          <Link href={`/filter?${searchParams.toString()}`} className="flex items-center gap-2 text-[#21D0B8] font-bold text-sm border-2 border-[#21D0B8] px-4 py-2 rounded-lg transition hover:bg-[#21D0B8] hover:text-white">  
             <FaFilter /> Фильтры
          </Link>
        </div>

        {activeFilters.length > 0 && (
          <div className="container mx-auto px-4 md:px-8 py-3 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800">
            {activeFilters.map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600 dark:text-gray-200">
                <span className="text-gray-400">{FILTER_LABELS[key] || key}:</span>
                <span>{value}</span>
                <button onClick={() => removeFilter(key)} className="text-gray-400 hover:text-red-500 ml-1"><FaTimes /></button>
              </div>
            ))}
            <button onClick={() => router.push('/catalog')} className="text-xs text-red-400 hover:text-red-600 underline ml-2">Сбросить всё</button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
             {Array.from({length: 10}).map((_, i) => (<div key={i} className="w-full aspect-2/3 bg-gray-200 rounded-xl animate-pulse"></div>))}
          </div>
        ) : (
          <>
            {animeData.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-400">Ничего не найдено :(</h2>
                    <Link href={`/filter?${searchParams.toString()}`} className="mt-6 inline-block bg-[#21D0B8] text-white px-6 py-2 rounded-lg font-bold">Изменить фильтры</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 justify-items-center">
                {animeData.map((anime) => (
                    <Link href={`/anime/${anime.id}`} key={anime.id} className="block group w-full max-w-60">
                    <div className="relative rounded-xl overflow-hidden  aspect-2/3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border-2 border-transparent group-hover:border-[#21D0B8]">
                        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md border border-yellow-500/50 px-2 py-1 rounded-lg shadow-lg">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-yellow-400 font-bold text-xs">{anime.rating || '?'}</span>
                        </div>
                        <Image src={anime.poster_url || '/placeholder.jpg'} alt={anime.title} fill className="object-cover transition-transform duration-500 group-hover:blur-[2px] group-hover:scale-110" unoptimized />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                                    {anime.year && <span className="bg-gray-700/80 px-2 py-0.5 rounded">{anime.year}</span>}
                                    {anime.type && <span className="bg-[#21D0B8]/20 text-[#21D0B8] px-2 py-0.5 rounded">{anime.type}</span>}
                                </div>
                                <button className="w-full bg-[#21D0B8] text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 text-xs"><FaPlay className="text-[10px]" /> Смотреть</button>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-3 text-center font-bold text-gray-800 text-sm truncate group-hover:text-[#21D0B8] transition-colors px-1 dark:text-gray-200">{anime.title}</h3>
                    </Link>
                ))}
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <div className="mt-16 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl  border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-gray-600 dark:text-gray-200"><FaChevronLeft /></button>
                        <div className="flex items-center gap-1 px-2">{renderPageNumbers()}</div>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-gray-600 dark:text-gray-200"><FaChevronRight /></button>
                    </div>
                    <div className="text-gray-400 text-xs mt-3 font-medium ">Страница {currentPage} из {totalPages}</div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

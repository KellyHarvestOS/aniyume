'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { Zap, Flame, Sparkles, Star } from 'lucide-react';

interface Genre { id: number; name: string; slug: string; }

interface HomeFiltersProps {
  onFilterChange: (filters: any) => void;
}

const HomeFilters: React.FC<HomeFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('smart');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isYearsOpen, setIsYearsOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const genresRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => String(currentYear - i));
  const types = [
    { value: 'tv', label: 'TV Сериал' },
    { value: 'movie', label: 'Фильм' },
    { value: 'ova', label: 'OVA' },
    { value: 'ona', label: 'ONA' },
    { value: 'special', label: 'Спешл' },
  ];

  const sortOptions = [
    { value: 'smart', label: 'Умная', Icon: Zap },
    { value: 'popularity', label: 'Популярные', Icon: Flame },
    { value: 'newest', label: 'Новинки', Icon: Sparkles },
    { value: 'rating', label: 'Рейтинг', Icon: Star },
  ];
  const currentSort = sortOptions.find(o => o.value === sort) || sortOptions[0];
  const CurrentSortIcon = currentSort.Icon;

  useEffect(() => {
    fetch('/api/external/public/tags')
      .then(res => res.json())
      .then(d => {
        if (d.success) setGenres(d.data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      });

    const handleClickOutside = (e: MouseEvent) => {
      if (genresRef.current && !genresRef.current.contains(e.target as Node)) setIsGenresOpen(false);
      if (yearsRef.current && !yearsRef.current.contains(e.target as Node)) setIsYearsOpen(false);
      if (typesRef.current && !typesRef.current.contains(e.target as Node)) setIsTypesOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, genre, year, type, sort });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, genre, year, type, sort]);

  const resetFilters = () => {
    setSearch('');
    setGenre('');
    setYear('');
    setType('');
    setSort('smart');
  };

  const hasFilters = search || genre || year || type || sort !== 'smart';

  return (
    <div className="container mx-auto px-4 mb-8 relative z-40">
      <div className="flex flex-col lg:flex-row gap-4 items-end bg-white/5 dark:bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 rounded-3xl shadow-xl shadow-black/10">
        
        {/* Search */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-500/70">Поиск</span>
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand transition-colors text-sm" />
            <input
              type="text"
              placeholder="Название аниме..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-black/5 dark:bg-black/20 border-2 border-transparent focus:border-brand/30 focus:bg-white dark:focus:bg-black/40 text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto h-12">
          
          {/* Genre */}
          <div className="relative flex-1 sm:flex-none sm:min-w-40" ref={genresRef}>
            <button
              onClick={() => setIsGenresOpen(!isGenresOpen)}
              className={`h-full w-full px-4 rounded-2xl bg-black/5 dark:bg-black/20 border-2 transition-all flex items-center justify-between gap-2 text-sm font-bold truncate ${isGenresOpen ? 'border-brand/40 bg-white/10' : 'border-transparent hover:border-white/10'}`}
            >
              <span className="truncate">{genres.find(g => g.slug === genre)?.name || 'Жанр'}</span>
              <FaChevronDown className={`text-[10px] transition-transform ${isGenresOpen ? 'rotate-180 text-brand' : 'text-gray-500'}`} />
            </button>
            {isGenresOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] z-50 bg-white dark:bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <button onClick={() => { setGenre(''); setIsGenresOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${!genre ? 'text-brand bg-brand/5 font-bold' : 'text-gray-500 hover:bg-white/5'}`}>Все жанры</button>
                  {genres.map(g => (
                    <button key={g.id} onClick={() => { setGenre(g.slug); setIsGenresOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${genre === g.slug ? 'text-brand bg-brand/5 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                      {g.name}
                      {genre === g.slug && <FaCheck className="text-[10px]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year */}
          <div className="relative flex-1 sm:flex-none sm:min-w-32" ref={yearsRef}>
            <button
              onClick={() => setIsYearsOpen(!isYearsOpen)}
              className={`h-full w-full px-4 rounded-2xl bg-black/5 dark:bg-black/20 border-2 transition-all flex items-center justify-between gap-2 text-sm font-bold ${isYearsOpen ? 'border-brand/40 bg-white/10' : 'border-transparent hover:border-white/10'}`}
            >
              <span>{year || 'Год'}</span>
              <FaChevronDown className={`text-[10px] transition-transform ${isYearsOpen ? 'rotate-180 text-brand' : 'text-gray-500'}`} />
            </button>
            {isYearsOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[120px] z-50 bg-white dark:bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <button onClick={() => { setYear(''); setIsYearsOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${!year ? 'text-brand bg-brand/5 font-bold' : 'text-gray-500 hover:bg-white/5'}`}>Любой</button>
                  {years.map(y => (
                    <button key={y} onClick={() => { setYear(y); setIsYearsOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${year === y ? 'text-brand bg-brand/5 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                      {y}
                      {year === y && <FaCheck className="text-[10px]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative flex-1 sm:flex-none sm:min-w-44" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`h-full w-full px-4 rounded-2xl bg-brand/10 dark:bg-brand/5 border-2 transition-all flex items-center justify-between gap-2 text-sm font-bold ${isSortOpen ? 'border-brand/40 bg-brand/15' : 'border-brand/20 hover:border-brand/40 text-brand'}`}
            >
              <span className="flex items-center gap-2 truncate"><CurrentSortIcon size={14} className="shrink-0" />{currentSort.label}</span>
              <FaChevronDown className={`text-[10px] transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[170px] z-50 bg-white dark:bg-[#1f1f1f] border border-brand/20 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
                {sortOptions.map(o => {
                  const OptIcon = o.Icon;
                  return (
                  <button key={o.value} onClick={() => { setSort(o.value); setIsSortOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${sort === o.value ? 'text-brand bg-brand/5 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                    <span className="flex items-center gap-2"><OptIcon size={14} className="shrink-0" />{o.label}</span>
                    {sort === o.value && <FaCheck className="text-[10px]" />}
                  </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-500/10 border-2 border-transparent hover:border-red-500/30 text-red-500 transition-all active:scale-95"
              title="Сбросить фильтры"
            >
              <FaTimes />
            </button>
          )}

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 226, 196, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default HomeFilters;

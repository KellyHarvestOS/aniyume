'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from 'react-icons/fa';

interface Episode {
  episode_number: number;
  [key: string]: any;
}

interface EpisodePickerProps {
  episodes: Episode[];
  currentEpisode: number;
  onSelect: (episodeNumber: number) => void;
  rangeSize?: number;
}

export default function EpisodePicker({
  episodes,
  currentEpisode,
  onSelect,
  rangeSize = 50,
}: EpisodePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRangeIdx, setActiveRangeIdx] = useState(0);
  const rangeScrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => a.episode_number - b.episode_number);
  }, [episodes]);

  const episodeNumbers = useMemo(() => sortedEpisodes.map(e => e.episode_number), [sortedEpisodes]);
  
  const ranges = useMemo(() => {
    if (episodeNumbers.length === 0) return [];
    const min = episodeNumbers[0];
    const max = episodeNumbers[episodeNumbers.length - 1];
    const result: { start: number; end: number; label: string }[] = [];
    
    for (let s = min; s <= max; s += rangeSize) {
      const end = Math.min(s + rangeSize - 1, max);
      result.push({
        start: s,
        end,
        label: s === end ? `${s}` : `${s}–${end}`,
      });
    }
    return result;
  }, [episodeNumbers, rangeSize]);

  // Find which range the current episode belongs to
  useEffect(() => {
    const idx = ranges.findIndex(r => currentEpisode >= r.start && currentEpisode <= r.end);
    if (idx >= 0) {
      setActiveRangeIdx(idx);
    }
  }, [currentEpisode, ranges]);

  // Scroll active range tab into view
  useEffect(() => {
    if (rangeScrollRef.current) {
      const activeTab = rangeScrollRef.current.children[activeRangeIdx] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeRangeIdx]);

  // Scroll to current episode in grid when range changes
  useEffect(() => {
    if (gridRef.current) {
      const currentBtn = gridRef.current.querySelector(`[data-ep="${currentEpisode}"]`) as HTMLElement;
      if (currentBtn) {
        currentBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeRangeIdx, currentEpisode]);

  const currentRange = ranges[activeRangeIdx] || { start: 0, end: 0 };
  const visibleEpisodes = useMemo(() => {
    if (searchQuery) {
      const q = parseInt(searchQuery);
      if (!isNaN(q)) {
        return episodeNumbers.filter(n => n.toString().includes(searchQuery));
      }
      return [];
    }
    return episodeNumbers.filter(n => n >= currentRange.start && n <= currentRange.end);
  }, [episodeNumbers, currentRange, searchQuery]);

  const currentIndex = episodeNumbers.indexOf(currentEpisode);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodeNumbers.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelect(episodeNumbers[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelect(episodeNumbers[currentIndex + 1]);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value.replace(/[^0-9]/g, ''));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(searchQuery);
    if (!isNaN(num) && episodeNumbers.includes(num)) {
      onSelect(num);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  if (episodeNumbers.length === 0) return null;

  // Simple mode for anime with ≤ 12 episodes
  if (episodeNumbers.length <= 12) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 
                       hover:bg-[#39bcba]/20 hover:text-[#39bcba] disabled:opacity-30 disabled:cursor-default 
                       transition-all duration-200"
            aria-label="Предыдущая серия"
          >
            <FaChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
            Серия {currentEpisode}
          </span>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 
                       hover:bg-[#39bcba]/20 hover:text-[#39bcba] disabled:opacity-30 disabled:cursor-default 
                       transition-all duration-200"
            aria-label="Следующая серия"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {episodeNumbers.map(num => (
            <button
              key={num}
              onClick={() => onSelect(num)}
              className={`w-12 h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${num === currentEpisode
                  ? 'bg-[#39bcba] text-white shadow-lg shadow-[#39bcba]/30 scale-105'
                  : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-[#39bcba]/20 hover:text-[#39bcba] border border-gray-200 dark:border-gray-700/50'
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Nav: Prev / Current / Next + Search toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 
                       hover:bg-[#39bcba]/20 hover:text-[#39bcba] disabled:opacity-30 disabled:cursor-default 
                       transition-all duration-200 border border-gray-200 dark:border-gray-700/50"
            aria-label="Предыдущая серия"
          >
            <FaChevronLeft size={13} />
          </button>
          <div className="px-4 py-2 rounded-lg bg-[#39bcba]/10 border border-[#39bcba]/30 
                          text-sm font-bold text-[#39bcba] min-w-[100px] text-center">
            Серия {currentEpisode}
          </div>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 
                       hover:bg-[#39bcba]/20 hover:text-[#39bcba] disabled:opacity-30 disabled:cursor-default 
                       transition-all duration-200 border border-gray-200 dark:border-gray-700/50"
            aria-label="Следующая серия"
          >
            <FaChevronRight size={13} />
          </button>
        </div>

        <button
          onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(''); }}
          className={`p-2.5 rounded-lg transition-all duration-200 border
            ${isSearchOpen
              ? 'bg-[#39bcba] text-white border-[#39bcba]'
              : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700/50 hover:bg-[#39bcba]/20 hover:text-[#39bcba]'
            }`}
          aria-label="Поиск серии"
        >
          {isSearchOpen ? <FaTimes size={13} /> : <FaSearch size={13} />}
        </button>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <form onSubmit={handleSearchSubmit} className="mb-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={13} />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Введите номер серии..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] 
                         border border-gray-200 dark:border-gray-700 text-sm
                         text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-[#39bcba]/40 focus:border-[#39bcba]
                         transition-all duration-200"
            />
          </div>
        </form>
      )}

      {/* Range tabs - only show if not searching and more than 1 range */}
      {!searchQuery && ranges.length > 1 && (
        <div
          ref={rangeScrollRef}
          className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ranges.map((range, idx) => (
            <button
              key={range.start}
              onClick={() => setActiveRangeIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0
                ${idx === activeRangeIdx
                  ? 'bg-[#39bcba] text-white shadow-md shadow-[#39bcba]/20'
                  : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-[#39bcba]/15 hover:text-[#39bcba] border border-gray-200 dark:border-gray-700/50'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Episode grid */}
      <div
        ref={gridRef}
        className="grid gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
          scrollbarWidth: 'thin',
        }}
      >
        {visibleEpisodes.map(num => (
          <button
            key={num}
            data-ep={num}
            onClick={() => {
              onSelect(num);
              if (searchQuery) {
                setSearchQuery('');
                setIsSearchOpen(false);
              }
            }}
            className={`h-10 rounded-lg text-sm font-medium transition-all duration-150
              ${num === currentEpisode
                ? 'bg-[#39bcba] text-white shadow-lg shadow-[#39bcba]/30 ring-2 ring-[#39bcba]/50'
                : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-[#39bcba]/20 hover:text-[#39bcba] border border-gray-200 dark:border-gray-700/40'
              }`}
            title={`Серия ${num}`}
          >
            {num}
          </button>
        ))}
        {visibleEpisodes.length === 0 && searchQuery && (
          <div className="col-span-full py-6 text-center text-gray-400 dark:text-gray-600 text-sm">
            Серия {searchQuery} не найдена
          </div>
        )}
      </div>

      {/* Episode count info */}
      <div className="mt-2 text-xs text-gray-400 dark:text-gray-600 text-right">
        Всего серий: {episodeNumbers.length}
      </div>
    </div>
  );
}

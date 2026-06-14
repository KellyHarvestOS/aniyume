'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRangeIdx, setActiveRangeIdx] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const rangeScrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => a.episode_number - b.episode_number);
  }, [episodes]);

  const episodeNumbers = useMemo(() => sortedEpisodes.map(e => e.episode_number), [sortedEpisodes]);

  // Collapse the big grid by default on small screens so the video stays reachable.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && episodeNumbers.length > 12) {
      setExpanded(false);
    }
  }, [episodeNumbers.length]);

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
    if (expanded && gridRef.current) {
      const currentBtn = gridRef.current.querySelector(`[data-ep="${currentEpisode}"]`) as HTMLElement;
      if (currentBtn) {
        currentBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeRangeIdx, currentEpisode, expanded]);

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
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400
                       hover:brand-bg-soft hover:brand-text disabled:opacity-30 disabled:cursor-default
                       transition-all duration-200 active:scale-95"
            aria-label={t('ep.prev')}
          >
            <FaChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
            {t('activity.episode', { n: currentEpisode })}
          </span>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400
                       hover:brand-bg-soft hover:brand-text disabled:opacity-30 disabled:cursor-default
                       transition-all duration-200 active:scale-95"
            aria-label={t('ep.next')}
          >
            <FaChevronRight size={14} />
          </button>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}>
          {episodeNumbers.map(num => (
            <button
              key={num}
              onClick={() => onSelect(num)}
              className={`h-11 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95
                ${num === currentEpisode
                  ? 'bg-brand text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:brand-bg-soft hover:brand-text border border-gray-200 dark:border-gray-700/50'
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
      {/* Nav: Prev / Current (tap to expand) / Next + Search toggle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className="shrink-0 p-3 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400
                       hover:brand-bg-soft hover:brand-text disabled:opacity-30 disabled:cursor-default
                       transition-all duration-200 border border-gray-200 dark:border-gray-700/50 active:scale-95"
            aria-label={t('ep.prev')}
          >
            <FaChevronLeft size={13} />
          </button>

          <button
            onClick={() => { setExpanded(v => !v); setSearchQuery(''); setIsSearchOpen(false); }}
            className="flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                       brand-bg-soft border brand-border text-sm font-bold brand-text
                       hover:brand-bg-soft transition-all duration-200 active:scale-[0.98]"
            aria-expanded={expanded}
            aria-label={t('ep.showList')}
          >
            <span className="truncate">{t('activity.episode', { n: currentEpisode })}</span>
            <FaChevronDown
              size={11}
              className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="shrink-0 p-3 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400
                       hover:brand-bg-soft hover:brand-text disabled:opacity-30 disabled:cursor-default
                       transition-all duration-200 border border-gray-200 dark:border-gray-700/50 active:scale-95"
            aria-label={t('ep.next')}
          >
            <FaChevronRight size={13} />
          </button>
        </div>

        <button
          onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(''); if (!expanded) setExpanded(true); }}
          className={`shrink-0 p-3 rounded-lg transition-all duration-200 border active:scale-95
            ${isSearchOpen
              ? 'brand-bg text-white brand-border'
              : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700/50 hover:brand-bg-soft hover:brand-text'
            }`}
          aria-label={t('ep.searchEp')}
        >
          {isSearchOpen ? <FaTimes size={13} /> : <FaSearch size={13} />}
        </button>
      </div>

      {/* Collapsible body */}
      {expanded && (
        <>
          {/* Search bar */}
          {isSearchOpen && (
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={13} />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t('ep.enterNumber')}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]
                             border border-gray-200 dark:border-gray-700 text-sm
                             text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none brand-focus
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95
                    ${idx === activeRangeIdx
                      ? 'brand-bg text-white shadow-md'
                      : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:brand-bg-soft hover:brand-text border border-gray-200 dark:border-gray-700/50'
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
            className="grid gap-1.5 max-h-[40vh] md:max-h-[280px] overflow-y-auto pr-1 scrollbar-thin overscroll-contain"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))', scrollbarWidth: 'thin' }}
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
                className={`h-11 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95
                  ${num === currentEpisode
                    ? 'brand-bg text-white shadow-lg ring-2 brand-ring'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:brand-bg-soft hover:brand-text border border-gray-200 dark:border-gray-700/40'
                  }`}
                title={t('activity.episode', { n: num })}
              >
                {num}
              </button>
            ))}
            {visibleEpisodes.length === 0 && searchQuery && (
              <div className="col-span-full py-6 text-center text-gray-400 dark:text-gray-600 text-sm">
                {t('ep.notFound', { n: searchQuery })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Episode count info */}
      <div className="mt-2 text-xs text-gray-400 dark:text-gray-600 text-right">
        {t('ep.total', { n: episodeNumbers.length })}
      </div>
    </div>
  );
}

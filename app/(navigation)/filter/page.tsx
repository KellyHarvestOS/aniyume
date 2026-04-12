'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

interface Genre { id: number; name: string; slug: string; }

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

const CustomSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Не важно';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col gap-1.5" ref={containerRef}>
      <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </span>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-12 px-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium
          ${isOpen
            ? 'border-brand-simple bg-white dark:bg-[#1a1a1a] ring-4 ring-brand/10'
            : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#161616] hover:border-gray-200 dark:hover:border-white/10'
          } text-gray-700 dark:text-gray-200`}
      >
        <span className="truncate">{selectedLabel}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 py-2 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/10 shadow-2xl shadow-black/20 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors
                ${value === '' ? 'text-brand bg-brand/5 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              Не важно
              {value === '' && <FaCheck className="w-3 h-3 icon-brand" />}
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors
                  ${value === opt.value ? 'text-brand bg-brand/5 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && <FaCheck className="w-3 h-3 icon-brand" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--brand-main); border-radius: 10px; opacity: 0.3; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--brand-main); }
      `}</style>
    </div>
  );
};

function FilterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [translators, setTranslators] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    genre: '', translator: '', year: '', season: '',
    status: '', type: '', sort: 'newest', ageRating: '', country: '',
  });

  useEffect(() => {
    setFilters({
      genre: searchParams.get('genre') || '',
      translator: searchParams.get('translator') || '',
      year: searchParams.get('year') || '',
      season: searchParams.get('season') || '',
      status: searchParams.get('status') || '',
      type: searchParams.get('type') || '',
      sort: searchParams.get('sort') || 'newest',
      ageRating: searchParams.get('ageRating') || '',
      country: searchParams.get('country') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const [tagsRes, trRes] = await Promise.all([
        fetch('/api/external/tags'),
        fetch('/api/external/episodes/translators')
      ]);
      if (tagsRes.ok) {
        const d = await tagsRes.json();
        setGenres((d.data || []).sort((a: any, b: any) => a.name.localeCompare(b.name)));
      }
      if (trRes.ok) {
        const d = await trRes.json();
        setTranslators(Array.from(new Set((d.data || []).map((t: any) => t.translator))).sort() as string[]);
      }
    };
    fetchData();
  }, []);

  const years = Array.from({ length: 46 }, (_, i) => ({ value: String(2025 - i), label: String(2025 - i) }));

  const handleChange = (key: string, val: string) => setFilters(p => ({ ...p, [key]: val }));

  const handleApply = () => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.append(k, v));
    router.push(`/catalog?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] pb-20">
      <header className="bg-white/90 dark:bg-[#111111]/90 border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6 pt-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-gray-900 dark:text-white">
            Настройка <span className="text-brand w-[20rem]">Фильтров</span>
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          <CustomSelect label="Жанры" value={filters.genre} onChange={v => handleChange('genre', v)} options={genres.map(g => ({ value: g.slug, label: g.name }))} />
          <CustomSelect label="Озвучка" value={filters.translator} onChange={v => handleChange('translator', v)} options={translators.map(t => ({ value: t, label: t }))} />
          <CustomSelect label="Сортировка" value={filters.sort} onChange={v => handleChange('sort', v)} options={[{ value: 'newest', label: 'Новые' }, { value: 'rating', label: 'По рейтингу' }, { value: 'popularity', label: 'Популярные' }, { value: 'title', label: 'По алфавиту' }]} />
          <CustomSelect label="Год выпуска" value={filters.year} onChange={v => handleChange('year', v)} options={years} />
          <CustomSelect label="Статус" value={filters.status} onChange={v => handleChange('status', v)} options={[{ value: 'finished', label: 'Завершен' }, { value: 'ongoing', label: 'Онгоинг' }, { value: 'upcoming', label: 'Анонс' }]} />
          <CustomSelect label="Тип контента" value={filters.type} onChange={v => handleChange('type', v)} options={[{ value: 'tv', label: 'TV Сериал' }, { value: 'movie', label: 'Фильм' }, { value: 'ova', label: 'OVA' }, { value: 'special', label: 'Спешл' }]} />
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-center pt-10 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => setFilters({ genre: '', translator: '', year: '', season: '', status: '', type: '', sort: 'newest', ageRating: '', country: '' })}
            className="w-full sm:w-auto px-10 h-14 rounded-2xl text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            Сбросить всё
          </button>
          <button
            onClick={handleApply}
            className="w-full sm:w-auto px-16 h-14 rounded-2xl bg-brand text-white font-bold shadow-2xl shadow-brand/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Применить фильтры
          </button>
        </div>
      </main>
    </div>
  );
}

export default function FilterPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center dark:bg-[#0A0A0A] text-gray-500">Загрузка...</div>}>
      <FilterPageContent />
    </Suspense>
  );
}
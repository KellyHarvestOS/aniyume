'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

export interface SourceItem {
  key: string;
  /** Отображаемое имя источника, напр. "AniLibria", "Kodik" */
  name: string;
  /** Озвучка/переводчик, если отличается от имени источника */
  translator?: string;
  /** Статус рекламы для бейджа */
  ads?: 'none' | 'maybe' | null;
  /** Подпись бейджа, напр. "без рекламы" / "возможна реклама" */
  adsLabel?: string;
}

interface SourceSelectProps {
  items: SourceItem[];
  value: string | null;
  onChange: (key: string) => void;
  className?: string;
  ariaLabel?: string;
}

const AdsBadge: React.FC<{ ads?: SourceItem['ads']; label?: string }> = ({ ads, label }) => {
  if (!ads || !label) return null;
  const styles =
    ads === 'none'
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles}`}>
      {label}
    </span>
  );
};

const ItemLabel: React.FC<{ item: SourceItem }> = ({ item }) => (
  <span className="min-w-0 flex items-center gap-2">
    <span className="truncate">
      {item.name}
      {item.translator ? ` · ${item.translator}` : ''}
    </span>
    <AdsBadge ads={item.ads} label={item.adsLabel} />
  </span>
);

export default function SourceSelect({ items, value, onChange, className = '', ariaLabel }: SourceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = items.find((it) => it.key === value) ?? items[0];

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  // При открытии — подсветить выбранный пункт
  useEffect(() => {
    if (isOpen) {
      const idx = items.findIndex((it) => it.key === value);
      setActiveIdx(idx >= 0 ? idx : 0);
    }
  }, [isOpen, items, value]);

  // Держать активный пункт в зоне видимости при навигации с клавиатуры
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const node = listRef.current.children[activeIdx] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, isOpen]);

  const commit = (key: string) => {
    onChange(key);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIdx(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIdx(items.length - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = items[activeIdx];
        if (item) commit(item.key);
        break;
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`flex items-center justify-between gap-2 w-full px-4 py-3 rounded-2xl text-sm font-bold text-left
          bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-200 outline-none border
          transition-all duration-200 active:scale-[0.99]
          ${isOpen ? 'brand-border ring-2 brand-ring' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
      >
        {selected ? <ItemLabel item={selected} /> : <span className="text-gray-400">—</span>}
        <FaChevronDown
          className={`shrink-0 w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand' : 'text-gray-400'}`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className={`source-select-pop source-select-scroll absolute top-[calc(100%+8px)] left-0 w-full z-50 max-h-[280px] overflow-y-auto p-1
                     rounded-2xl bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/10 shadow-2xl shadow-black/20`}
        >
          {items.map((it, idx) => {
            const isSelected = it.key === value;
            const isActive = idx === activeIdx;
            return (
              <li key={it.key} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => commit(it.key)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all
                    ${
                      isSelected
                        ? 'brand-bg-soft brand-text font-bold'
                        : isActive
                          ? 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200'
                          : 'text-gray-700 dark:text-gray-200'
                    }`}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all
                      ${isSelected ? 'brand-bg' : 'border-2 border-gray-300 dark:border-white/20'}`}
                  >
                    {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <ItemLabel item={it} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <style jsx>{`
        .source-select-pop {
          transform-origin: top;
          animation: source-select-in 0.18s ease-out;
        }
        @keyframes source-select-in {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .source-select-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .source-select-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .source-select-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        :global(.dark) .source-select-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

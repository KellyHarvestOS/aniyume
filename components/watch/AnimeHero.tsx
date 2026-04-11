'use client';

import React, { useState, useRef } from 'react';
import { FaPlay, FaStar, FaShareAlt, FaCheck } from 'react-icons/fa';
import { AnimeDetails } from '@/types/anime';

interface AnimeHeroProps {
  anime: AnimeDetails;
  episodesCount: number;
}

export default function AnimeHero({ anime, episodesCount }: AnimeHeroProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const tagsList = anime.tags || anime.genres || [];
  const displayGenres = tagsList.slice(0, 3);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDescription = () => {
    if (isExpanded && descriptionRef.current) {
      descriptionRef.current.scrollTop = 0;
    }
    setIsExpanded(!isExpanded);
  };

  const cleanDescription = anime.description ? anime.description.replace(/<[^>]+>/g, '') : '';
  const isLongDescription = cleanDescription.length > 180;

  return (
    <div className="relative w-full min-h-[850px] flex items-start bg-white dark:bg-[#111111] transition-colors">
      <style dangerouslySetInnerHTML={{
        __html: `
        .left-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .left-scrollbar::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 4px;
        }
        .left-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--brand-main);
          border-radius: 4px;
        }
      `}} />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={anime.poster_url || '/placeholder.jpg'}
          alt={anime.title}
          className="w-full h-full object-cover object-top scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/20 to-transparent dark:from-[#111111] dark:via-[#111111]/20"></div>
        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent dark:from-[#111111]"></div>
        <div className="absolute top-0 right-0 w-[55%] h-full blur-[100px] opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-20 pt-20 md:pt-20 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide text-black dark:text-gray-200 drop-shadow-lg">
            {anime.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-6">
            <span className="bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-gray-200 px-2 py-0.5 rounded border border-gray-900 dark:border-gray-700 uppercase">
              {anime.type || 'TV'}
            </span>
            <ul className="flex items-center gap-2 list-none">
              <li>• {anime.year}</li>
              <li>• {anime.status}</li>
            </ul>
            <div className="flex items-center gap-1 ml-2">
              <FaStar className="text-brand text-sm" />
              <span className="ml-1 text-gray-800 dark:text-gray-200 font-semibold">
                {anime.rating} ({anime.popularity ? `${(anime.popularity / 1000).toFixed(0)}K` : '0'})
              </span>
            </div>
          </div>

          {displayGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {displayGenres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/70 dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-400 dark:border-gray-700 rounded-full text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider shadow-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand hover:bg-brand-hover text-black dark:text-[#111111] text-lg font-bold py-3 px-8 rounded flex items-center gap-3 transition transform hover:scale-105 shadow-lg"
            >
              <FaPlay className="text-sm" /> СМОТРЕТЬ
            </button>

            <div className="flex gap-3 relative">
              <button
                onClick={handleShare}
                title="Скопировать ссылку"
                className={`w-12 h-12 flex items-center justify-center border-2 rounded transition bg-white/40 dark:bg-[#1a1a1a]/70 backdrop-blur-sm 
                  ${copied
                    ? 'border-teal-500 text-teal-500'
                    : 'border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-black dark:hover:border-gray-200'
                  }`}
              >
                {copied ? <FaCheck /> : <FaShareAlt />}
              </button>

              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                  Скопировано!
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm md:text-[15px] leading-relaxed relative">
            <div className="flex flex-col items-start">
              <div
                ref={descriptionRef}
                className={`text-black dark:text-gray-200 drop-shadow-md w-full transition-all duration-300
                  ${isExpanded
                    ? 'max-h-56 overflow-y-auto left-scrollbar'
                    : 'line-clamp-4 overflow-hidden'
                  }`}
                dir={isExpanded ? 'rtl' : 'ltr'}
              >
                <div
                  dir="ltr"
                  className={isExpanded ? 'pl-4 pr-1' : ''}
                  dangerouslySetInnerHTML={{ __html: anime.description || 'Описание отсутствует' }}
                />
              </div>

              {isLongDescription && (
                <button
                  onClick={handleToggleDescription}
                  className="mt-2 text-brand hover:text-brand-hover dark:text-brand dark:hover:text-brand-hover text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {isExpanded ? 'Свернуть описание' : 'Читать далее...'}
                </button>
              )}
            </div>

            <div className="text-gray-800 dark:text-gray-300 text-xs md:text-sm space-y-3 font-medium">
              <p>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Оригинал:</span>{' '}
                {anime.title_english || '-'}
              </p>
              <p>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Всего серий:</span>{' '}
                {episodesCount > 0 ? episodesCount : '?'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { FaPlay, FaStar, FaShareAlt, FaCheck } from 'react-icons/fa';
import { AnimeDetails } from '@/types/anime';

interface AnimeHeroProps {
  anime: AnimeDetails;
  episodesCount: number;
}

const TYPE_LABELS: Record<string, string> = {
  tv: 'TV',
  movie: 'Фильм',
  ova: 'OVA',
  ona: 'ONA',
  special: 'Special',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ongoing: { label: 'Онгоинг', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  finished: { label: 'Завершён', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Завершён', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  announced: { label: 'Анонс', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

export default function AnimeHero({ anime, episodesCount }: AnimeHeroProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tagsList = anime.tags || anime.genres || [];
  const displayGenres = tagsList.slice(0, 3);

  const posterUrl = anime.poster_url || '/placeholder.jpg';
  const bannerUrl = anime.cover_url || posterUrl;

  const cleanDescription = anime.description ? anime.description.replace(/<[^>]+>/g, '') : '';
  const isLong = cleanDescription.length > 200;

  const statusInfo = STATUS_LABELS[anime.status?.toLowerCase()] || { label: anime.status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch { }
  };

  return (
    <div className="relative w-full min-h-[85vh] md:min-h-[60vh] flex items-center bg-white dark:bg-[#111111] transition-colors overflow-hidden">


      <div className="absolute inset-0 z-0 overflow-hidden bg-white dark:bg-[#111111]" aria-hidden="true">

        <div
          className="absolute top-0 right-0 h-full w-full md:w-[75%] lg:w-[60%]"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
          }}
        >
          <img
            src={bannerUrl}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent dark:from-[#111111] dark:via-[#111111]/80" />
        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent dark:from-[#111111]" />

        <div className="absolute top-0 right-0 w-[55%] h-full bg-teal-400/20 blur-[140px] opacity-60 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-20 pt-20 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide text-black dark:text-gray-200 drop-shadow-lg">
            {anime.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-6">
            <span className="bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-gray-200 px-2 py-0.5 rounded border border-gray-900 dark:border-gray-700 uppercase">
              {TYPE_LABELS[anime.type?.toLowerCase()] || anime.type || 'TV'}
            </span>
            <ul className="flex items-center gap-2 list-none">
              {anime.year && <li>• {anime.year}</li>}
              <li>• {statusInfo.label}</li>
              {episodesCount > 0 && <li>• {episodesCount} эп.</li>}
            </ul>
            <div className="flex items-center gap-1 ml-2">
              <FaStar className="text-teal-400 text-sm" />
              <span className="ml-1 text-gray-800 dark:text-gray-200 font-semibold">
                {anime.rating || '—'} ({anime.popularity ? `${(anime.popularity / 1000).toFixed(0)}K` : '0'})
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
              className="bg-teal-400 hover:bg-teal-500 text-black dark:text-[#111111] text-lg font-bold py-3 px-8 rounded flex items-center gap-3 transition transform hover:scale-105 shadow-lg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm md:text-[15px] leading-relaxed">
            <div>
              <p
                className={`mb-2 text-black dark:text-gray-200 drop-shadow-md ${isExpanded ? '' : 'line-clamp-4'}`}
                dangerouslySetInnerHTML={{ __html: anime.description || 'Описание отсутствует' }}
              />
              {isLong && (
                <button
                  onClick={() => setIsExpanded((value) => !value)}
                  className="text-teal-500 hover:text-teal-600 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {isExpanded ? 'Свернуть ↑' : 'Читать далее...'}
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
                {anime.episodes_count || episodesCount > 0 ? anime.episodes_count || episodesCount : '?'}
              </p>
              {anime.duration && (
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Длительность:</span>{' '}
                  {anime.duration} мин.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
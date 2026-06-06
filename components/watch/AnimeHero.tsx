import React, { useState } from 'react';
import { FaPlay, FaStar, FaShareAlt, FaCheck, FaChevronDown } from 'react-icons/fa';
import { AnimeDetails } from '@/types/anime';
import { BiMessageSquareDetail } from "react-icons/bi";

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

const STATUS_LABELS: Record<string, { label: string; dot: string }> = {
  ongoing: { label: 'Онгоинг', dot: 'bg-brand' },
  finished: { label: 'Завершён', dot: 'bg-brand' },
  completed: { label: 'Завершён', dot: 'bg-brand' },
  announced: { label: 'Анонс', dot: 'bg-brand' },
};

export default function AnimeHero({ anime, episodesCount }: AnimeHeroProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tagsList = anime.tags || anime.genres || [];
  const displayGenres = tagsList.slice(0, 4);

  const posterUrl = anime.poster_url || '/placeholder.jpg';

  const cleanDescription = anime.description ? anime.description.replace(/<[^>]+>/g, '') : '';
  const isLong = cleanDescription.length > 250;

  const statusInfo = STATUS_LABELS[anime.status?.toLowerCase()] || {
    label: anime.status || 'Неизвестно',
    dot: 'bg-gray-500'
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch { }
  };

  return (
    <div className="relative w-full min-h-[90vh] flex items-center bg-white dark:bg-[#111111] transition-colors py-16 lg:py-10 overflow-hidden border-b border-gray-200 dark:border-gray-800 ">

      <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#111111] dark:via-[#111111]/80 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-[#111111] dark:via-transparent dark:to-[#111111] opacity-80" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start mx-auto">

          <div className="w-[65%] sm:w-[50%] md:w-[320px] lg:w-[360px] shrink-0 relative group perspective">
            <div className="absolute -inset-4 bg-black/20 dark:bg-white/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative w-full border border-gray-300 dark:border-gray-700 aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-500 ease-out bg-[#1a1a1a]">
              <img
                src={posterUrl}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center">

            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm font-semibold tracking-wide">
              <span className="bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-gray-200 px-3 py-1 rounded border border-gray-300 dark:border-gray-700 uppercase shadow-sm">
                {TYPE_LABELS[anime.type?.toLowerCase()] || anime.type || 'TV'}
              </span>
              <div className="flex items-center gap-2 bg-white/50 dark:bg-[#1a1a1a]/50 text-gray-800 dark:text-gray-300 px-3 py-1 rounded border border-gray-300 dark:border-gray-700 backdrop-blur-sm">
                <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </div>
              {anime.year && (
                <span className="text-gray-600 dark:text-gray-400 font-bold px-1">
                  • {anime.year}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-wide text-black dark:text-gray-200 drop-shadow-lg leading-tight md:leading-tight lg:leading-[1.1]">
              {anime.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1a1a1a]/80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 backdrop-blur-md shadow-sm w-fit">
                <FaStar className="text-brand text-lg drop-shadow-md" />
                <span className="text-gray-900 dark:text-white font-bold text-lg leading-none">
                  {anime.rating || '—'}
                </span>
                {anime.popularity > 0 && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium pl-2 border-l border-gray-300 dark:border-gray-600">
                    {(anime.popularity / 1000).toFixed(1)}K оценок
                  </span>
                )}
              </div>

              {displayGenres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayGenres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1.5 bg-white/70 dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-400 dark:border-gray-700 rounded-full text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider shadow-sm hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors cursor-default"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={() => document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative overflow-hidden bg-brand text-white dark:text-[#111111] text-lg font-bold py-3.5 px-10 rounded-lg flex items-center gap-3 transition transform hover:scale-105 shadow-lg hover:shadow-brand/30 hover:brightness-110 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <FaPlay className="text-sm relative z-10" />
                <span className="relative z-10">СМОТРЕТЬ</span>
              </button>

              <div className="relative">
                <button
                  onClick={handleShare}
                  title="Скопировать ссылку"
                  className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg transition-all duration-300 bg-white/40 dark:bg-[#1a1a1a]/70 backdrop-blur-sm 
                    ${copied
                      ? 'border-brand text-brand shadow-lg'
                      : 'border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-black dark:hover:border-gray-400 hover:bg-white/80 dark:hover:bg-[#1a1a1a]'
                    }`}
                >
                  {copied ? <FaCheck className="text-xl scale-in" /> : <FaShareAlt className="text-xl" />}
                </button>

                {copied && (
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white font-semibold text-xs py-2 px-3 rounded shadow-xl whitespace-nowrap z-50">
                    Скопировано!
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-[15px] leading-relaxed">

              <div className="lg:col-span-8 relative">

                <div 
                  className={`text-black dark:text-gray-300 text-base leading-[1.8] transition-all duration-300 ${
                    isExpanded 
                      ? 'max-h-[220px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full' 
                      : 'line-clamp-4 relative overflow-hidden'
                  }`}
                >
                  <p dangerouslySetInnerHTML={{ __html: anime.description || 'Описание отсутствует' }} />

                  {!isExpanded && isLong && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-[#111111] to-transparent pointer-events-none" />
                  )}
                </div>
                
                {isLong && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-brand text-sm font-bold uppercase tracking-wider transition-colors hover:brightness-125 mt-3 flex items-center gap-2 group"
                  >
                    {isExpanded ? 'Свернуть текст' : 'Читать далее'}
                    <FaChevronDown 
                      className={`text-xs transform transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'
                      }`} 
                    />
                  </button>
                )}
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4 text-sm text-gray-800 dark:text-gray-300 bg-gray-50/80 dark:bg-[#1a1a1a]/80 p-6 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-sm h-fit">
                <div className="flex items-center gap-2 mb-2 text-black dark:text-white font-bold text-base border-b border-gray-200 dark:border-gray-800 pb-3">
                  <BiMessageSquareDetail className="text-brand text-lg" />
                  <span>Детали</span>
                </div>

                <div className="space-y-3 font-medium">
                  {anime.title_english && (
                    <p>
                      <span className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Оригинал</span>
                      <span className="text-black dark:text-gray-200">{anime.title_english}</span>
                    </p>
                  )}
                  <p>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Всего серий</span>
                    <span className="text-black dark:text-gray-200">
                      {anime.episodes_count || episodesCount > 0 ? anime.episodes_count || episodesCount : 'Неизвестно'}
                    </span>
                  </p>
                  {anime.duration && (
                    <p>
                      <span className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Длительность</span>
                      <span className="text-black dark:text-gray-200">{anime.duration} мин.</span>
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
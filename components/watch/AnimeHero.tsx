'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaStar, FaShareAlt, FaCheck, FaTv, FaFilm } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimeDetails } from '@/types/anime';
import { getAnimeBanner } from '@/lib/api';

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
  ongoing:   { label: 'Онгоинг',    color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  finished:  { label: 'Завершён',   color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Завершён',   color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  announced: { label: 'Анонс',      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

export default function AnimeHero({ anime, episodesCount }: AnimeHeroProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [fetchedBanner, setFetchedBanner] = useState<string | null>(null);
  const descRef = useRef<HTMLDivElement>(null);

  // 1. Fetch banner progressive load
  useEffect(() => {
    if (anime.id) {
      getAnimeBanner(anime.id).then((data) => {
        if (data.banner) setFetchedBanner(data.banner);
      });
    }
  }, [anime.id]);

  const tagsList = anime.tags || anime.genres || [];

  // 2. Logic for banners: fetched > cover_url > poster_url
  const posterUrl = anime.poster_url || '/placeholder.jpg';
  const bannerUrl = fetchedBanner || anime.cover_url || posterUrl;

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
    <div className="relative w-full min-h-[540px] md:min-h-[620px] overflow-hidden bg-[#0a0a0a]">

      {/* ── Фоновый баннер (Progressive Loading) ── */}
      <div className="absolute inset-0 z-0 bg-[#060606]" aria-hidden="true">
        
        {/* 1. LQIP: Размытый постер как фон пока грузится основной баннер */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={posterUrl}
            alt=""
            className="w-full h-full object-cover blur-3xl scale-110 opacity-40 brightness-50"
          />
        </motion.div>

        {/* 2. Основной баннер с анимацией появления */}
        <AnimatePresence mode="wait">
          <motion.img
            key={bannerUrl}
            src={bannerUrl}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: bannerLoaded ? 1 : 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            onLoad={() => setBannerLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ imageRendering: 'auto' }}
          />
        </AnimatePresence>

        {/* Градиенты и оверлеи */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── Контент ── */}
      <div className="relative z-10 container mx-auto px-4 md:px-12 py-10 md:py-14 flex flex-col md:flex-row gap-8 md:gap-12 items-start">

        {/* Постер */}
        <div className="hidden md:block shrink-0">
          <div className="relative w-44 lg:w-52 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 group">
            <img
              src={posterUrl}
              alt={anime.title}
              className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Рейтинг поверх постера */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-500/30">
              <FaStar className="text-yellow-400 text-[10px]" />
              <span className="text-yellow-400 text-xs font-black">{anime.rating || '—'}</span>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="flex-1 min-w-0 pt-0 md:pt-4">

          {/* Теги жанров */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tagsList.slice(0, 4).map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/5 border border-white/10 text-gray-400 backdrop-blur-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Название */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-3 drop-shadow-2xl">
            {anime.title}
          </h1>

          {anime.title_english && (
            <p className="text-gray-500 text-sm font-medium mb-4 tracking-wider truncate">
              {anime.title_english}
            </p>
          )}

          {/* Мета-строка */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Тип */}
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/8 border border-white/10 rounded-lg text-xs font-bold text-gray-300 uppercase backdrop-blur-sm">
              {anime.type?.toLowerCase() === 'movie' ? <FaFilm size={10} /> : <FaTv size={10} />}
              {TYPE_LABELS[anime.type?.toLowerCase()] || anime.type || 'TV'}
            </span>

            {/* Год */}
            {anime.year && (
              <span className="text-gray-400 text-sm font-bold">{anime.year}</span>
            )}

            {/* Статус */}
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>

            {/* Эпизоды */}
            {episodesCount > 0 && (
              <span className="text-gray-500 text-xs font-bold">
                {episodesCount} эп.
              </span>
            )}

            {/* Рейтинг (мобильный) */}
            <span className="flex items-center gap-1 md:hidden">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-yellow-400 text-sm font-black">{anime.rating || '—'}</span>
            </span>
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-brand shadow-lg shadow-brand/30 hover:brightness-110 active:scale-95 transition-all duration-200 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
              <FaPlay className="text-xs relative z-10" />
              <span className="relative z-10">Смотреть</span>
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                title="Скопировать ссылку"
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 backdrop-blur-sm
                  ${copied
                    ? 'bg-brand/20 border-brand text-brand'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
              >
                {copied ? <FaCheck size={14} /> : <FaShareAlt size={14} />}
              </button>
              {copied && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap font-bold border border-white/10">
                  Скопировано!
                </span>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="max-w-xl">
            <div
              ref={descRef}
              className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}
              dangerouslySetInnerHTML={{ __html: anime.description || 'Описание отсутствует' }}
            />
            {isLong && (
              <button
                onClick={() => setIsExpanded(v => !v)}
                className="mt-2 text-brand hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {isExpanded ? 'Свернуть ↑' : 'Читать далее...'}
              </button>
            )}
          </div>

          {/* Доп. инфо */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 font-medium border-t border-white/5 pt-5">
            {anime.title_english && (
              <span><span className="text-gray-500">Оригинал:</span> {anime.title_english}</span>
            )}
            {(anime.episodes_count || episodesCount > 0) && (
              <span><span className="text-gray-500">Всего серий:</span> {anime.episodes_count || episodesCount}</span>
            )}
            {anime.duration && (
              <span><span className="text-gray-500">Длительность:</span> {anime.duration} мин.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import EpisodePicker from './EpisodePicker';
import { Episode } from '@/types/anime';
import { FaStar } from 'react-icons/fa';
import { useWatchTracker } from '@/hooks/useWatchTracker';
import { useRouter } from 'next/navigation';
import CreateRoomModal from '@/components/watch-party/CreateRoomModal';

interface AnimePlayerProps {
  animeId: number;
  anime?: any;
  episodes: Episode[];
  onEpisodeSelect?: (episodeNumber: number) => void;
}

export default function AnimePlayer({ animeId, anime, episodes, onEpisodeSelect }: AnimePlayerProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

  useWatchTracker({
    episodeId: currentEpisode?.id,
    token: token
  });

  useEffect(() => {
    const fetchRating = async () => {
      if (!token || !animeId) return;
      try {
        const res = await fetch(`/api/external/ratings/anime/${animeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.rating) setUserRating(data.rating);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRating();
  }, [animeId, token]);

  const handleRate = async (value: number) => {
    if (!token) return alert("Пожалуйста, войдите в аккаунт");
    setIsRatingLoading(true);
    try {
      const res = await fetch('/api/external/ratings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ anime_id: animeId, rating: value })
      });
      if (res.ok) setUserRating(value);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const uniqueEpisodes = useMemo(() => {
    const map = new Map<number, Episode>();
    episodes.forEach((ep) => {
      if (!map.has(ep.episode_number) && ep.player_url) {
        map.set(ep.episode_number, ep);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.episode_number - b.episode_number);
  }, [episodes]);

  useEffect(() => {
    if (uniqueEpisodes.length > 0 && !currentEpisode) {
      setCurrentEpisode(uniqueEpisodes[0]);
    }
  }, [uniqueEpisodes, currentEpisode]);

  const handleEpisodeChange = (epNum: number) => {
    const ep = uniqueEpisodes.find(e => e.episode_number === epNum);
    if (ep) {
      setCurrentEpisode(ep);
      if (onEpisodeSelect) onEpisodeSelect(ep.episode_number);
    }
  };

  const getVideoSrc = (url: string | null) => {
    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <div id="player" className="container mx-auto px-4 md:px-12 py-10 dark:bg-[#111111]">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold text-black dark:text-gray-200">
              {currentEpisode ? `Серия ${currentEpisode.episode_number}` : 'Плеер'}
            </h2>
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isRatingLoading}
                  className={`transition-all duration-200 transform ${
                    isRatingLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-90'
                  }`}
                >
                  <FaStar
                    size={22}
                    className={`transition-colors duration-200 ${
                      star <= (hoverRating || userRating)
                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                        : 'text-gray-200 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
              {userRating > 0 && !hoverRating && (
                <span className="ml-2 text-xs font-black text-[#39bcba]">{userRating}/5</span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px]">
              {uniqueEpisodes.length > 0 && currentEpisode && (
                <EpisodePicker
                  episodes={uniqueEpisodes}
                  currentEpisode={currentEpisode.episode_number}
                  onSelect={handleEpisodeChange}
                />
              )}
            </div>
          </div>
        </div>
        
        {anime && currentEpisode && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowCreateRoom(true)}
              className="bg-[#21D0B8] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg shadow-[#21D0B8]/20 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
              Включить вместе (Watch Party)
            </button>
          </div>
        )}

        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-500 bg-black">
          {currentEpisode?.player_url ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={getVideoSrc(currentEpisode.player_url)}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white">
              Видео недоступно
            </div>
          )}
        </div>
      </div>
      <hr className="border-gray-500 mb-10" />

      {showCreateRoom && anime && currentEpisode && (
         <CreateRoomModal
           anime={anime}
           episodeNumber={currentEpisode.episode_number}
           onClose={() => setShowCreateRoom(false)}
           onCreated={(code) => {
             if (router) {
               router.push(`/watch-party/${code}`);
             }
           }}
         />
      )}
    </div>
  );
}
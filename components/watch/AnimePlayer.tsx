"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Hls from 'hls.js';
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
  const [resumeProgress, setResumeProgress] = useState<number>(0);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [hasResumed, setHasResumed] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const hlsRef = React.useRef<Hls | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

  useWatchTracker({
    episodeId: currentEpisode?.id,
    token: token,
    progress: playbackProgress,
  });

  const saveProgress = async (progress: number, completed = false, episodeId = currentEpisode?.id) => {
    if (!token || !episodeId || progress < 0) return;

    try {
      await fetch('/api/external/watch-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          episode_id: episodeId,
          progress: Math.floor(progress),
          delta_time: 0,
          completed,
        }),
        keepalive: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    if (!animeId || !token || uniqueEpisodes.length === 0) return;

    const fetchLastProgress = async () => {
      try {
        const res = await fetch(`/api/external/watch-history/anime/${animeId}/last-episode`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!res.ok) return;

        const data = await res.json();
        const episode = uniqueEpisodes.find((ep) => ep.id === data.episode_id)
          || uniqueEpisodes.find((ep) => ep.episode_number === data.last_episode);

        if (episode) {
          setCurrentEpisode(episode);
          setResumeProgress(Number(data.progress || 0));
          setPlaybackProgress(Number(data.progress || 0));
          setHasResumed(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLastProgress();
  }, [animeId, token, uniqueEpisodes]);

  useEffect(() => {
    const video = videoRef.current;
    const playerUrl = currentEpisode?.player_url ? getVideoSrc(currentEpisode.player_url) : '';

    if (!video || !playerUrl || !playerUrl.includes('.m3u8')) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
      });

      hlsRef.current = hls;
      hls.loadSource(playerUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playerUrl;
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [currentEpisode?.id, currentEpisode?.player_url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasResumed || resumeProgress < 5) return;

    const seek = () => {
      const safeProgress = video.duration && resumeProgress > video.duration - 30 ? 0 : resumeProgress;
      if (safeProgress > 0) {
        video.currentTime = safeProgress;
      }
      setHasResumed(true);
    };

    video.addEventListener('loadedmetadata', seek, { once: true });
    video.addEventListener('canplay', seek, { once: true });

    return () => {
      video.removeEventListener('loadedmetadata', seek);
      video.removeEventListener('canplay', seek);
    };
  }, [resumeProgress, hasResumed, currentEpisode?.id]);

  const handleEpisodeChange = (epNum: number) => {
    const ep = uniqueEpisodes.find(e => e.episode_number === epNum);
    if (ep) {
      if (videoRef.current?.currentTime) {
        saveProgress(videoRef.current.currentTime);
      }
      setResumeProgress(0);
      setPlaybackProgress(0);
      setHasResumed(false);
      setCurrentEpisode(ep);
      saveProgress(0, false, ep.id);
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
                  className={`transition-all duration-200 transform ${isRatingLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-90'
                    }`}
                >
                  <FaStar
                    size={22}
                    className={`transition-colors duration-200 ${star <= (hoverRating || userRating)
                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                        : 'text-gray-200 dark:text-gray-700'
                      }`}
                  />
                </button>
              ))}
              {userRating > 0 && !hoverRating && (
                <span className="ml-2 text-xs font-black text-brand">{userRating}/5</span>
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
              className="bg-[#39bcba] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg shadow-[#21D0B8]/20 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
              Включить вместе (Watch Party)
            </button>
          </div>
        )}

        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-500 bg-black">
          {currentEpisode?.player_url ? (
            currentEpisode.player_url.includes('.m3u8') ? (
              <video
                ref={videoRef}
                controls
                className="absolute top-0 left-0 w-full h-full bg-black outline-none"
                crossOrigin="anonymous"
                onTimeUpdate={(event) => setPlaybackProgress(event.currentTarget.currentTime)}
                onPause={(event) => saveProgress(event.currentTarget.currentTime)}
                onEnded={(event) => saveProgress(event.currentTarget.currentTime, true)}
              />
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={getVideoSrc(currentEpisode.player_url)}
                frameBorder="0"
                allowFullScreen
              />
            )
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

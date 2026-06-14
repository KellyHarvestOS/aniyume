"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Hls from 'hls.js';
import EpisodePicker from './EpisodePicker';
import SourceSelect, { SourceItem } from './SourceSelect';
import { Episode } from '@/types/anime';
import { FaStar } from 'react-icons/fa';
import { useWatchTracker } from '@/hooks/useWatchTracker';
import { useRouter } from 'next/navigation';
import CreateRoomModal from '@/components/watch-party/CreateRoomModal';
import { useI18n } from '@/contexts/I18nContext';

interface AnimePlayerProps {
  animeId: number;
  anime?: any;
  episodes: Episode[];
  onEpisodeSelect?: (episodeNumber: number) => void;
}

export default function AnimePlayer({ animeId, anime, episodes, onEpisodeSelect }: AnimePlayerProps) {
  const { t } = useI18n();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedSourceKey, setSelectedSourceKey] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [resumeProgress, setResumeProgress] = useState<number>(0);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [hasResumed, setHasResumed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const hlsRef = React.useRef<Hls | null>(null);
  const completedEpisodeIdsRef = React.useRef<Set<number>>(new Set());
  const watchedSecondsRef = React.useRef<number>(0);
  const lastPlaybackAtRef = React.useRef<number | null>(null);
  const lastVideoTimeRef = React.useRef<number>(0);

  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

  useWatchTracker({
    episodeId: currentEpisode?.id,
    token: token,
    progress: playbackProgress,
    isPlaying: isPlaying,
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

  const markEpisodeWatched = async (episode = currentEpisode) => {
    if (!token || !episode?.id || completedEpisodeIdsRef.current.has(episode.id)) return;

    completedEpisodeIdsRef.current.add(episode.id);

    const progress = videoRef.current?.currentTime ?? playbackProgress;

    await saveProgress(progress, true, episode.id);

    try {
      await fetch(`/api/external/anime/${animeId}/episodes-watched/${episode.episode_number}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      completedEpisodeIdsRef.current.delete(episode.id);
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
    if (!token) return alert(t('player.pleaseLogin'));
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

  const sourceRank = (ep: Episode) => {
    if (ep.source === 'anilibria') return 0;
    if (ep.source === 'videocdn') return 1;
    if (ep.source === 'kodik') return 2;
    if (ep.source === 'allanime') return 3;
    return 4;
  };

  const sourceKey = (ep: Episode) => `${ep.source ?? 'unknown'}::${ep.translator ?? 'Без озвучки'}::${ep.translation_type ?? ''}`;

  const sourceDisplayName = (ep: Episode) =>
    ep.source === 'anilibria' ? 'AniLibria'
      : ep.source === 'kodik' ? 'Kodik'
      : ep.source === 'videocdn' ? 'VideoCDN'
      : ep.source === 'allanime' ? 'AllAnime'
      : ep.source ?? t('player.source');

  // Убираем ведущий разделитель " · " из i18n-строк рекламы для отдельного бейджа.
  const stripSep = (s: string) => s.replace(/^\s*·\s*/, '').trim();

  const sourceItem = (ep: Episode): SourceItem => {
    const name = sourceDisplayName(ep);
    const translator = ep.translator && ep.translator !== name ? ep.translator : undefined;
    const ads: SourceItem['ads'] =
      ep.source === 'kodik' ? 'maybe' : ep.source === 'anilibria' ? 'none' : null;
    const adsLabel =
      ads === 'maybe' ? stripSep(t('player.mayHaveAds')) : ads === 'none' ? stripSep(t('player.noAds')) : undefined;
    return { key: sourceKey(ep), name, translator, ads, adsLabel };
  };

  const sourceOptions = useMemo(() => {
    const map = new Map<string, Episode>();
    episodes.filter((ep) => ep.player_url).forEach((ep) => {
      const key = sourceKey(ep);
      const current = map.get(key);
      if (!current || sourceRank(ep) < sourceRank(current) || (ep.priority ?? 999) < (current.priority ?? 999)) {
        map.set(key, ep);
      }
    });
    return Array.from(map.values()).sort((a, b) => sourceRank(a) - sourceRank(b) || (a.priority ?? 999) - (b.priority ?? 999));
  }, [episodes]);

  const sourceItems = useMemo(() => sourceOptions.map(sourceItem), [sourceOptions, t]);

  useEffect(() => {
    if (!selectedSourceKey && sourceOptions.length > 0) {
      setSelectedSourceKey(sourceKey(sourceOptions[0]));
    }
  }, [sourceOptions, selectedSourceKey]);

  const uniqueEpisodes = useMemo(() => {
    const map = new Map<number, Episode>();
    const preferredKey = selectedSourceKey ?? (sourceOptions[0] ? sourceKey(sourceOptions[0]) : null);
    const sortedEpisodes = [...episodes].filter((ep) => ep.player_url).sort((a, b) => sourceRank(a) - sourceRank(b) || (a.priority ?? 999) - (b.priority ?? 999));

    sortedEpisodes.forEach((ep) => {
      if (preferredKey && sourceKey(ep) !== preferredKey) return;
      if (!map.has(ep.episode_number)) map.set(ep.episode_number, ep);
    });

    if (map.size === 0) {
      sortedEpisodes.forEach((ep) => {
        if (!map.has(ep.episode_number)) map.set(ep.episode_number, ep);
      });
    }

    return Array.from(map.values()).sort((a, b) => a.episode_number - b.episode_number);
  }, [episodes, selectedSourceKey, sourceOptions]);

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
      watchedSecondsRef.current = 0;
      lastPlaybackAtRef.current = null;
      lastVideoTimeRef.current = 0;
      setIsPlaying(false);
      setCurrentEpisode(ep);
      if (onEpisodeSelect) onEpisodeSelect(ep.episode_number);
    }
  };

  const handleSourceChange = (key: string) => {
    setSelectedSourceKey(key);
    const currentNumber = currentEpisode?.episode_number ?? uniqueEpisodes[0]?.episode_number;
    const next = episodes.find((ep) => ep.player_url && ep.episode_number === currentNumber && sourceKey(ep) === key)
      || episodes.find((ep) => ep.player_url && sourceKey(ep) === key);

    if (next) {
      if (videoRef.current?.currentTime) void saveProgress(videoRef.current.currentTime);
      setResumeProgress(0);
      setPlaybackProgress(0);
      setHasResumed(false);
      watchedSecondsRef.current = 0;
      lastPlaybackAtRef.current = null;
      lastVideoTimeRef.current = 0;
      setIsPlaying(false);
      setCurrentEpisode(next);
      if (onEpisodeSelect) onEpisodeSelect(next.episode_number);
    }
  };

  const getVideoSrc = (url: string | null) => {
    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
  };

  // Эпизод засчитывается, только если реально просмотрено не менее 75%.
  // watchedSecondsRef копит честное время просмотра без перемоток и без 2x.
  const WATCHED_THRESHOLD = 0.75;
  const hasWatchedEnough = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return false;
    return watchedSecondsRef.current >= video.duration * WATCHED_THRESHOLD;
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const progress = video.currentTime;
    const now = performance.now();
    const previousPlaybackAt = lastPlaybackAtRef.current;
    const previousVideoTime = lastVideoTimeRef.current;

    if (!video.paused && previousPlaybackAt !== null) {
      const realDelta = Math.max(0, (now - previousPlaybackAt) / 1000);
      const videoDelta = progress - previousVideoTime;

      // Кредит за просмотр = насколько продвинулось видео, но не больше реально
      // прошедшего времени. Это отсекает перемотки (большой videoDelta при
      // крошечном realDelta) и не даёт 2x накручивать счётчик быстрее реального
      // времени. Перемотки назад (videoDelta < 0) не засчитываются.
      if (videoDelta > 0 && realDelta > 0) {
        watchedSecondsRef.current += Math.min(videoDelta, realDelta);
      }
    }

    lastPlaybackAtRef.current = now;
    lastVideoTimeRef.current = progress;

    setPlaybackProgress(progress);

    if (!currentEpisode) return;

    if (hasWatchedEnough()) {
      void markEpisodeWatched(currentEpisode);
    }
  };

  const handleSeeking = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    lastPlaybackAtRef.current = performance.now();
    lastVideoTimeRef.current = event.currentTarget.currentTime;
  };

  const handlePlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsPlaying(true);
    lastPlaybackAtRef.current = performance.now();
    lastVideoTimeRef.current = event.currentTarget.currentTime;
  };

  const handlePause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsPlaying(false);
    lastPlaybackAtRef.current = null;
    lastVideoTimeRef.current = event.currentTarget.currentTime;
    void saveProgress(event.currentTarget.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (currentEpisode && hasWatchedEnough()) void markEpisodeWatched(currentEpisode);
  };

  return (
    <div id="player" className="container mx-auto px-4 md:px-12 py-10 dark:bg-[#111111]">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold text-black dark:text-gray-200">
              {currentEpisode ? t('activity.episode', { n: currentEpisode.episode_number }) : t('player.player')}
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
            {sourceOptions.length > 1 && (
              <SourceSelect
                className="w-full sm:w-[320px]"
                ariaLabel={t('player.source')}
                items={sourceItems}
                value={selectedSourceKey}
                onChange={handleSourceChange}
              />
            )}
          </div>
        </div>

        {anime && currentEpisode && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowCreateRoom(true)}
              className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
              {t('player.watchTogether')}
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
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onSeeking={handleSeeking}
                onSeeked={handleSeeking}
                onPause={handlePause}
                onEnded={handleEnded}
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
              {t('player.videoUnavailable')}
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

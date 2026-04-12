'use client';

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import AnimeHero from "@/components/watch/AnimeHero";
import AnimePlayer from "@/components/watch/AnimePlayer";
import AnimeComments from "@/components/watch/AnimeComments";
import AnimeSidebar from "@/components/watch/AnimeSidebar";
import AnimeActions from "@/components/watch/AnimeActions";
import AnimeViewSkeleton from "@/components/skeletons/AnimeViewSkeleton";
import { AnimeDetails, Episode } from "@/types/anime";
import { CommunityStats } from "@/types/profile";

const STATUS_CONFIG: Record<string, string> = {
  watching: "bg-green-500",
  planned: "bg-purple-500",
  completed: "bg-blue-500",
  on_hold: "bg-yellow-500",
  dropped: "bg-red-500",
};

export default function AnimeViewPage() {
  const { id } = useParams();
  const API_BASE = "/api/external";

  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeDetails[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [animeRes, epRes, recRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/public/anime/${id}`),
          fetch(`${API_BASE}/public/anime/${id}/episodes`),
          fetch(`${API_BASE}/public/anime?sort=popularity&page=1`),
          fetch(`${API_BASE}/public/anime/${id}/community-stats`),
        ]);

        if (!animeRes.ok) {
          return notFound();
        }

        const animeJson = await animeRes.json();
        const epJson = await epRes.json();
        const recJson = await recRes.json();
        let statsJson = null;
        if (statsRes.ok) statsJson = await statsRes.json();

        const rawData = animeJson.data || animeJson;

        if (!rawData || (rawData.message && rawData.message.includes("not found"))) {
          return notFound();
        }

        if (rawData.tags && (!rawData.genres || rawData.genres.length === 0)) {
          rawData.genres = rawData.tags;
        }

        setAnime(rawData);
        setCommunityStats(statsJson);
        // Бэкенд возвращает эпизоды сгруппированными по переводчику: { "AniLibria": [...], ... }
        const epData = epJson.data;
        let flatEpisodes: Episode[] = [];
        if (Array.isArray(epData)) {
          flatEpisodes = epData;
        } else if (epData && typeof epData === 'object') {
          flatEpisodes = (Object.values(epData) as Episode[][]).flat();
        }
        setAllEpisodes(flatEpisodes);
        setRecommendations((recJson.data || []).filter((a: any) => String(a.id) !== String(id)).slice(0, 4));
      } catch (err) {
        return notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleProgressUpdate = async (episodeId: number, seconds: number, completed: boolean = false) => {
    const currentToken = token || localStorage.getItem("userToken");
    if (!currentToken || !episodeId || seconds < 1) return;

    try {
      const res = await fetch(`${API_BASE}/watch-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          episode_id: Number(episodeId),
          progress: Math.floor(seconds),
          completed: completed
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(errorText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEpisodeWatch = async (episodeNumber: number) => {
    if (!token || !id) return;
    try {
      await fetch(`${API_BASE}/anime/${id}/episodes-watched/${episodeNumber}`, { // PATCH /anime/{id}/episodes-watched/{n}
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <AnimeViewSkeleton />;
  if (!anime) return notFound();

  const totalStats = communityStats?.total || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-black dark:text-gray-200 font-sans overflow-x-hidden transition-colors">
      <AnimeHero anime={anime} episodesCount={allEpisodes.length} />

      <div className="container mx-auto px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <AnimeActions
            animeId={anime.id}
            initialFavCount={(anime as any).favorites_count || 0}
          />

          {communityStats && totalStats > 0 && (
            <div className="flex-1 w-full pt-1">
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] mb-2">
                {['watching', 'planned', 'completed', 'on_hold', 'dropped'].map(key => {
                  const count = (communityStats as any)[key] || 0;
                  const percent = (count / totalStats) * 100;
                  if (percent === 0) return null;
                  return (
                    <div
                      key={key}
                      style={{ width: `${percent}%` }}
                      className={STATUS_CONFIG[key] || 'bg-gray-400'}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 font-medium px-1">
                <span>В списках: {totalStats}</span>
                <span>{communityStats.watching} смотрят</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimePlayer
        animeId={anime.id}
        anime={anime}
        episodes={allEpisodes}
        onEpisodeSelect={handleEpisodeWatch}
      />

      <div className="container mx-auto px-4 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <AnimeComments animeId={id as string} />
          <AnimeSidebar recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}
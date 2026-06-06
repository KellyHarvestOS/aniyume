'use client';

import AnimeComments from '@/components/watch/AnimeComments';
import AnimeHero from '@/components/watch/AnimeHero';
import AnimePlayer from '@/components/watch/AnimePlayer';
import type { AnimeDetails, Episode } from '@/types/anime';

const anime: AnimeDetails = {
  id: 999999,
  title: 'Лунный Архив: Новый Hero',
  title_english: 'Moon Archive: New Hero',
  poster_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop',
  cover_url: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1800&auto=format&fit=crop',
  rating: '8.7',
  popularity: 28400,
  description: 'Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.Временное аниме для проверки нового hero-блока: баннер слева, информация справа, premium brand-цвета и адаптив.',
  year: 2026,
  type: 'tv',
  status: 'ongoing',
  episodes_count: 1,
  duration: 24,
  genres: [
    { id: 1, name: 'Фэнтези', slug: 'fantasy' },
    { id: 2, name: 'Драма', slug: 'drama' },
    { id: 3, name: 'Preview', slug: 'preview' },
  ],
};

const episodes: Episode[] = [
  {
    id: 9999991,
    anime_id: anime.id,
    episode_number: 1,
    season_number: 1,
    title: 'Пять минут до рассвета',
    player_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    translator: 'Preview',
  },
];

export default function PreviewAnimePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-black dark:text-gray-200 font-sans overflow-x-hidden transition-colors">


      <AnimeHero anime={anime} episodesCount={episodes.length} />
      <AnimePlayer animeId={anime.id} anime={anime} episodes={episodes} />

      <div className="container mx-auto px-4 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <AnimeComments animeId={anime.id} preview />
        </div>
      </div>
    </div>
  );
}

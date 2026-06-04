// types/anime.ts

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  season_number: number;
  title: string | null;
  player_url: string | null;
  translator: string | null;
  translation_type?: string | null;
  source?: string | null;
  priority?: number | null;
  thumbnail_url?: string | null;
}

export interface AnimeDetails {
  id: number;
  title: string;
  title_english?: string;
  title_jp?: string;
  poster_url: string;
  cover_url?: string;
  rating: string;
  popularity: number;
  description: string;
  year: number;
  type: string;
  status: string;
  episodes_count?: number;
  duration?: number;
  genres?: Genre[];
  tags?: Genre[];
  favorites_count?: number;
}

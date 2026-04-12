// lib/api.ts — централизованный API клиент

const API_BASE = '/api/external';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Anime {
  id: number;
  title: string;
  image?: string;
  poster_url?: string;
  rating?: number;
  description?: string;
  year?: number;
  release_year?: number;
  type?: string;
  status?: string;
}

export interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  title?: string;
  video_url?: string;
  player_url?: string;
  image?: string;
}

// ─── Core client ────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userToken');
}

async function apiClient(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

// ─── Public API object ───────────────────────────────────────────────────────

export const api = {
  get: (path: string) =>
    apiClient(path),

  post: (path: string, body: unknown) =>
    apiClient(path, { method: 'POST', body: JSON.stringify(body) }),

  put: (path: string, body: unknown) =>
    apiClient(path, { method: 'PUT', body: JSON.stringify(body) }),

  patch: (path: string, body?: unknown) =>
    apiClient(path, {
      method: 'PATCH',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),

  delete: (path: string) =>
    apiClient(path, { method: 'DELETE' }),
};

// ─── SWR fetcher (публичные эндпоинты) ──────────────────────────────────────

export const swrFetcher = (url: string) => fetch(url).then((r) => r.json());

// ─── Legacy functions (SSR-совместимые) ─────────────────────────────────────
// Используются там, где нужен прямой вызов без токена (например, серверные компоненты)

export async function getAnimeList(page = 1, filters: Record<string, string> = {}): Promise<Anime[]> {
  const params = new URLSearchParams({ page: page.toString(), ...filters });
  const res = await fetch(`${API_BASE}/anime?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch anime list');
  const data = await res.json();
  return data.data || data;
}

export async function getAnimeById(id: string): Promise<Anime> {
  const res = await fetch(`${API_BASE}/anime/${id}`, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) throw new Error('Failed to fetch anime details');
  return res.json();
}

export async function getAnimeEpisodes(id: string): Promise<Episode[]> {
  const res = await fetch(`${API_BASE}/anime/${id}/episodes`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || data;
}

export async function searchAnime(query: string) {
  const res = await fetch(`${API_BASE}/anime?search=${encodeURIComponent(query)}`);
  return res.json();
}
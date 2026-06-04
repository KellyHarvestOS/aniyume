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
  translator?: string | null;
  translation_type?: string | null;
  source?: string | null;
  priority?: number | null;
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

  const fingerprintId = typeof window !== 'undefined' ? localStorage.getItem('visitor_fp_id') : null;
  if (fingerprintId) {
    headers['X-Fingerprint-ID'] = fingerprintId;
  }

  const url = `${API_BASE}${path}`;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API REQUEST] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (process.env.NODE_ENV === 'development') {
      if (!response.ok) {
        console.error(`[API ERROR] ${options.method || 'GET'} ${url} returned ${response.status} ${response.statusText}`);
        // Попытка прочитать текст ошибки без краша (клонируем ответ)
        const errorText = await response.clone().text().catch(() => 'No text');
        console.error(`[API ERROR DETAILS]:`, errorText);
      } else {
        console.log(`[API SUCCESS] ${options.method || 'GET'} ${url} (${response.status})`);
      }
    }
    
    return response;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API FETCH FAILED] ${options.method || 'GET'} ${url}`, err);
    }
    throw err;
  }
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
  const res = await fetch(`${API_BASE}/public/anime?${params}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`[API ERROR] GET /public/anime?${params} returned ${res.status}`);
    const errText = await res.clone().text().catch(()=>'');
    console.error(`Details:`, errText);
    throw new Error('Failed to fetch anime list');
  }
  const data = await res.json();
  return data.data || data;
}

export async function getAnimeById(id: string): Promise<Anime> {
  const url = `${API_BASE}/public/anime/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) {
    console.error(`[API ERROR] GET ${url} returned ${res.status}`);
    const errText = await res.clone().text().catch(()=>'');
    console.error(`Details:`, errText);
    throw new Error('Failed to fetch anime details');
  }
  return res.json();
}

export async function getAnimeBanner(id: string | number): Promise<{ banner: string | null; cover: string | null }> {
  const url = `${API_BASE}/public/anime/${id}/banner`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
    if (!res.ok) return { banner: null, cover: null };
    return res.json();
  } catch {
    return { banner: null, cover: null };
  }
}

export async function getAnimeEpisodes(id: string): Promise<Episode[]> {
  const url = `${API_BASE}/public/anime/${id}/episodes`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`[API ERROR] GET ${url} returned ${res.status}`);
    return [];
  }
  const data = await res.json();
  // Бэкенд возвращает объект { "AniLibria": [...] } — флэттим
  if (Array.isArray(data.data)) return data.data;
  if (data.data && typeof data.data === 'object') return (Object.values(data.data) as Episode[][]).flat();
  return [];
}

export async function searchAnime(query: string) {
  const res = await fetch(`${API_BASE}/public/anime?search=${encodeURIComponent(query)}`);
  return res.json();
}

export async function submitContactMessage(payload: {
  name?: string;
  email?: string;
  category: string;
  subject: string;
  message: string;
  attachment?: File | null;
}) {
  let response: Response;

  if (payload.attachment) {
    const form = new FormData();
    if (payload.name) form.set('name', payload.name);
    if (payload.email) form.set('email', payload.email);
    form.set('category', payload.category);
    form.set('subject', payload.subject);
    form.set('message', payload.message);
    form.set('photo', payload.attachment);

    const headers: HeadersInit = { Accept: 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    response = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers,
      body: form,
    });
  } else {
    response = await api.post('/contacts', payload);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Не удалось отправить сообщение');
  }
  return data;
}

export async function submitReport(payload: {
  target_type: 'anime' | 'comment' | 'user';
  target_id: number;
  category: 'spam' | 'abuse' | 'toxicity' | 'bug' | 'content' | 'copyright' | 'other';
  reason: string;
  details?: string;
}) {
  const response = await api.post('/reports', payload);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Не удалось отправить жалобу');
  }
  return data;
}

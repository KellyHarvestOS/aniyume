const PREFIX = "profile_pref";

export function setActiveProfileUserId(userId: number | string | null | undefined) {
  if (typeof window === "undefined") return;
  if (userId == null) localStorage.removeItem("activeProfileUserId");
  else localStorage.setItem("activeProfileUserId", String(userId));
}

export function getProfilePreference(key: string, fallback: string | null = null): string | null {
  if (typeof window === "undefined") return fallback;
  const userId = localStorage.getItem("activeProfileUserId");
  if (!userId) return fallback;
  return localStorage.getItem(`${PREFIX}:${userId}:${key}`) ?? fallback;
}

export function setProfilePreference(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  const userId = localStorage.getItem("activeProfileUserId");
  if (!userId) return;
  const storageKey = `${PREFIX}:${userId}:${key}`;
  if (value == null) localStorage.removeItem(storageKey);
  else localStorage.setItem(storageKey, value);
}

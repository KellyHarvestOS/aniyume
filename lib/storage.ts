export function getStorageAssetUrl(value?: string | null): string | null {
  if (!value) return null;

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//")) {
    return value;
  }

  const path = value
    .replace(/^\/+/, "")
    .replace(/^api-storage\//, "")
    .replace(/^storage\//, "");

  if (typeof window !== "undefined" && window.location.hostname.replace(/^www\./, "") === "aniyume.tech") {
    return `https://api.aniyume.tech/storage/${path}`;
  }

  return `/api-storage/${path}`;
}

export function getAvatarUrl(value?: string | null): string | null {
  const url = getStorageAssetUrl(value);
  if (!url) return null;

  return `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
}

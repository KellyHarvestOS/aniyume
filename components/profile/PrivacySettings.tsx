"use client";

import { useEffect, useState } from "react";
import { FaHeart, FaHistory, FaStar, FaLock, FaCheck } from "react-icons/fa";

type Level = "everyone" | "friends" | "nobody";

type PrivacyState = {
  favorites: Level;
  watch_history: Level;
  ratings: Level;
};

type SectionKey = keyof PrivacyState;

const SECTIONS: { key: SectionKey; label: string; hint: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "favorites", label: "Избранное", hint: "Кто видит ваши лайки аниме", icon: FaHeart },
  { key: "watch_history", label: "История просмотров", hint: "Кто видит, что вы смотрите", icon: FaHistory },
  { key: "ratings", label: "Оценки", hint: "Кто видит ваши оценки аниме", icon: FaStar },
];

const OPTIONS: { value: Level; label: string }[] = [
  { value: "everyone", label: "Все" },
  { value: "friends", label: "Друзья" },
  { value: "nobody", label: "Никто" },
];

const DEFAULTS: PrivacyState = { favorites: "friends", watch_history: "friends", ratings: "friends" };

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState<PrivacyState>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        const res = await fetch("/api/external/profile/me/privacy", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setPrivacy({
            favorites: data.favorites ?? "friends",
            watch_history: data.watch_history ?? "friends",
            ratings: data.ratings ?? "friends",
          });
        }
      } catch {
        // оставляем дефолты
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = async (key: SectionKey, value: Level) => {
    const previous = privacy;
    const next = { ...privacy, [key]: value };
    setPrivacy(next);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("/api/external/profile/me/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error();
      setSavedAt(Date.now());
    } catch {
      setPrivacy(previous);
      setError("Не удалось сохранить настройку приватности");
    }
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-[0.15em] ml-1">
          <FaLock className="text-brand" /> Приватность профиля
        </label>
        {savedAt && !error && (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-500">
            <FaCheck className="text-[10px]" /> Сохранено
          </span>
        )}
      </div>
      <p className="ml-1 text-xs font-semibold text-slate-400">
        Выберите, кто может видеть разделы вашего профиля. Изменения сохраняются сразу.
      </p>

      <div className="space-y-3">
        {SECTIONS.map(({ key, label, hint, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#161616] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm dark:bg-[#111111]">
                <Icon className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white">{label}</p>
                <p className="text-[11px] font-semibold text-slate-400">{hint}</p>
              </div>
            </div>

            <div className="flex shrink-0 rounded-lg bg-white p-1 dark:bg-[#111111]">
              {OPTIONS.map((opt) => {
                const active = privacy[key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={loading}
                    onClick={() => update(key, opt.value)}
                    className={`px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-[0.1em] transition-all disabled:opacity-50 ${
                      active
                        ? "bg-brand text-white dark:text-black shadow"
                        : "text-slate-500 hover:text-brand dark:text-gray-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="ml-1 text-[11px] font-bold text-red-500">{error}</p>}
    </div>
  );
}

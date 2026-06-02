export interface ProfileWatchTime {
  days?: number;
  hours?: number;
  minutes?: number;
  total_seconds?: number;
}

export const MAX_PROFILE_LEVEL = 100;
const LEVEL_2_MINUTES = 20;
const LEVEL_3_MINUTES = 50;
const YEAR_AT_THREE_HOURS_PER_DAY_MINUTES = 365 * 3 * 60;

export const minutesFromWatchTime = (watchTime?: ProfileWatchTime | null) => {
  if (!watchTime) return 0;

  if (typeof watchTime.total_seconds === 'number' && Number.isFinite(watchTime.total_seconds)) {
    return Math.max(0, Math.floor(watchTime.total_seconds / 60));
  }

  return Math.max(
    0,
    (watchTime.days || 0) * 24 * 60 + (watchTime.hours || 0) * 60 + (watchTime.minutes || 0),
  );
};

export const getMinutesForProfileLevel = (level: number) => {
  const safeLevel = Math.min(MAX_PROFILE_LEVEL, Math.max(1, Math.floor(level)));

  if (safeLevel <= 1) return 0;
  if (safeLevel === 2) return LEVEL_2_MINUTES;
  if (safeLevel === 3) return LEVEL_3_MINUTES;

  const remainingMinutes = YEAR_AT_THREE_HOURS_PER_DAY_MINUTES - LEVEL_3_MINUTES;
  const progress = (safeLevel - 3) / (MAX_PROFILE_LEVEL - 3);

  return Math.round(LEVEL_3_MINUTES + remainingMinutes * progress);
};

export const getProfileLevel = (watchTime?: ProfileWatchTime | null) => {
  const minutes = minutesFromWatchTime(watchTime);

  if (minutes < LEVEL_2_MINUTES) return 1;
  if (minutes < LEVEL_3_MINUTES) return 2;

  const remainingMinutes = Math.max(0, YEAR_AT_THREE_HOURS_PER_DAY_MINUTES - LEVEL_3_MINUTES);
  const progress = Math.min(1, (minutes - LEVEL_3_MINUTES) / remainingMinutes);
  const level = 3 + Math.floor(progress * (MAX_PROFILE_LEVEL - 3));

  return Math.min(MAX_PROFILE_LEVEL, Math.max(3, level));
};

export const formatWatchMinutes = (minutes: number) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const days = Math.floor(safeMinutes / 1440);
  const hours = Math.floor((safeMinutes % 1440) / 60);
  const mins = safeMinutes % 60;

  if (days > 0) return `${days}д ${hours}ч ${mins}м`;
  if (hours > 0) return `${hours}ч ${mins}м`;
  return `${mins}м`;
};

export const getProfileLevelTheme = (level: number) => {
  if (level <= 10) return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/70';
  if (level <= 20) return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/70';
  if (level <= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/70 dark:text-yellow-300 dark:border-yellow-800/70';
  if (level <= 40) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800/70';
  if (level <= 50) return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/70 dark:text-pink-300 dark:border-pink-800/70';
  if (level <= 60) return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800/70';
  if (level <= 70) return 'bg-zinc-900 text-zinc-100 border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-700';
  if (level <= 80) return 'bg-linear-to-r from-emerald-50 to-sky-100 text-slate-800 border-slate-200 dark:from-emerald-950 dark:to-sky-950 dark:text-emerald-200 dark:border-sky-800/70';
  if (level <= 90) return 'bg-linear-to-r from-yellow-100 via-pink-100 to-violet-100 text-slate-800 border-slate-200 dark:from-yellow-950 dark:via-pink-950 dark:to-violet-950 dark:text-pink-200 dark:border-pink-800/70';
  return 'bg-linear-to-r from-zinc-900 via-violet-900 to-teal-900 text-white border-zinc-700 dark:from-black dark:via-violet-950 dark:to-teal-950 dark:text-white dark:border-teal-800/70';
};

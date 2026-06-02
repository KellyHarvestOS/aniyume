import React from 'react';
import { getProfileLevel, getProfileLevelTheme, ProfileWatchTime } from '@/lib/profileLevel';

export type { ProfileWatchTime } from '@/lib/profileLevel';

interface ProfileLevelBadgeProps {
  watchTime?: ProfileWatchTime | null;
  className?: string;
}

export default function ProfileLevelBadge({ watchTime, className = '' }: ProfileLevelBadgeProps) {
  const level = getProfileLevel(watchTime);
  const theme = getProfileLevelTheme(level);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border px-1 py-0.5 backdrop-blur-sm ${theme} ${className}`}
      title={`Уровень ${level}`}
      aria-label={`Уровень ${level}`}
    >
      <span className="flex h-4 min-w-4 items-center justify-center rounded-md bg-white px-0.5 text-[9px] font-black leading-none text-black dark:bg-black/35 dark:text-white">
        {level}
      </span>
      <span className="pr-0.5 text-[8px] font-black uppercase leading-none tracking-wide">
        уровень
      </span>
    </div>
  );
}

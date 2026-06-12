'use client';

import React from 'react';
import { getAvatarFrameFit } from '@/lib/avatarFrames';
import { avatarFrames } from '@/app/profile/edit/premiumEdit/constants';

// Базовые px-смещения (x/y) в AVATAR_FRAME_FIT откалиброваны под крупный аватар
// профиля (~128px). Для мелких аватаров (хедер/сайдбар чата) их нужно масштабировать
// пропорционально размеру, иначе смещение визуально «перевешивает».
const FRAME_FIT_REFERENCE_PX = 128;

export const getAvatarFramePath = (frameKey?: string | null): string | null =>
  avatarFrames.find((frame) => frame.key === frameKey)?.imagePath || null;

const scalePx = (value: string | undefined, scale: number): string => {
  if (!value) return '0px';
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${numeric * scale}px`;
};

interface AvatarFrameOverlayProps {
  frameKey?: string | null;
  /** Диаметр аватара в px — для пропорционального масштабирования px-смещений рамки. */
  avatarSize: number;
}

/**
 * Декоративная рамка поверх аватара. Размеры (size/width/height) заданы в процентах
 * и масштабируются от контейнера аватара, поэтому каждая рамка получает свой точный
 * размер автоматически. Контейнер-родитель должен быть `relative` и совпадать по
 * размеру с аватаром.
 */
export default function AvatarFrameOverlay({ frameKey, avatarSize }: AvatarFrameOverlayProps) {
  const framePath = getAvatarFramePath(frameKey);
  if (!framePath) return null;

  const fit = getAvatarFrameFit(frameKey);
  const scale = avatarSize / FRAME_FIT_REFERENCE_PX;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: fit.width || fit.size,
        height: fit.height || fit.size,
        marginLeft: scalePx(fit.x, scale),
        marginTop: scalePx(fit.y, scale),
      }}
    >
      <img
        src={framePath}
        alt=""
        className="h-full w-full object-contain"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}

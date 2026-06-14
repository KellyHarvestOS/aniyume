'use client';

import { useEffect, useRef, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Делаем Pusher доступным глобально для Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

// Демо-медиа для общесайтового эффекта при активной рассылке.
const DEMO_MEDIA_ID = 'yo5CILhgvT4';

/**
 * Слушатель глобальной real-time рассылки.
 * Подписывается на публичный канал `global` и реагирует на событие
 * `global.broadcast`: при активном состоянии показывает общесайтовый
 * медиа-эффект всем посетителям.
 */
export default function GlobalBroadcastListener() {
  const [active, setActive] = useState(false);
  const echoRef = useRef<Echo<any> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
    });

    echoRef.current = echo;

    // Публичный канал — авторизация не нужна, принимают все посетители.
    echo.channel('global').listen('.global.broadcast', (data: { active: boolean }) => {
      setActive(Boolean(data?.active));
    });

    return () => {
      try {
        echo.leave('global');
        echo.disconnect();
      } catch {
        /* noop */
      }
      echoRef.current = null;
    };
  }, []);

  if (!active) return null;

  const overlays = Array.from({ length: 24 });

  return (
    <>
      {/* Скрытый медиа-элемент. autoplay=1; браузер может потребовать
          предварительного взаимодействия со страницей, чтобы разрешить звук. */}
      <iframe
        title="global-broadcast-media"
        src={`https://www.youtube.com/embed/${DEMO_MEDIA_ID}?autoplay=1&loop=1&playlist=${DEMO_MEDIA_ID}`}
        allow="autoplay"
        style={{ position: 'fixed', width: 1, height: 1, left: -9999, top: -9999, border: 0 }}
      />

      {/* Полупрозрачный общесайтовый оверлей-эффект */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 9999,
        }}
      >
        {overlays.map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const size = 40 + ((i * 17) % 80);
          const delay = (i % 10) * 0.4;
          const duration = 4 + (i % 5);
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                fontSize: size,
                fontWeight: 900,
                color: 'rgba(255,45,85,0.18)',
                textShadow: '0 0 18px rgba(123,47,247,0.35)',
                animation: `gbFloat ${duration}s ease-in-out ${delay}s infinite`,
                userSelect: 'none',
              }}
            >
              67
            </span>
          );
        })}
      </div>

      <style>{`
        @keyframes gbFloat {
          0%   { transform: translateY(0) rotate(-6deg); opacity: 0.12; }
          50%  { transform: translateY(-28px) rotate(6deg); opacity: 0.32; }
          100% { transform: translateY(0) rotate(-6deg); opacity: 0.12; }
        }
      `}</style>
    </>
  );
}

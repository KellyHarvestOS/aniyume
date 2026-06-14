'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageAssetUrl } from '@/lib/storage';

if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

interface Invite {
  invite_id: number;
  from_user_name: string;
  from_user_avatar: string;
  room_code: string;
  anime_title: string;
}

interface DeclineNote {
  id: string;
  declined_by_name: string;
  anime_title: string;
}

/**
 * Глобальные уведомления совместного просмотра:
 * - приглашения в комнату (приходят realtime + догружаются при заходе, т.к.
 *   хранятся в БД — офлайн-друг увидит их позже);
 * - уведомление хосту, что его приглашение отклонили.
 * Подписка на приватный канал user.{id} живёт на уровне всего приложения.
 */
export default function InviteNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [declines, setDeclines] = useState<DeclineNote[]>([]);
  const echoRef = useRef<Echo<any> | null>(null);

  const addInvite = (inv: Invite) => {
    setInvites((prev) => (prev.some((i) => i.invite_id === inv.invite_id) ? prev : [...prev, inv]));
  };

  useEffect(() => {
    if (!user?.id || typeof window === 'undefined') return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

    let cancelled = false;

    // Догружаем ожидающие приглашения (офлайн-доставка)
    api
      .get('/watch-party/invites')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        list.forEach((data: any) =>
          addInvite({
            invite_id: data.invite_id,
            from_user_name: data.from_user_name ?? 'Друг',
            from_user_avatar: data.from_user_avatar ?? '',
            room_code: data.room_code,
            anime_title: data.anime_title ?? '',
          }),
        );
      })
      .catch(() => {});

    const echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: '/api/external/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    echoRef.current = echo;

    const channel = echo.private(`user.${user.id}`);

    channel.listen('.friend.invite', (data: any) => {
      addInvite({
        invite_id: data.invite_id,
        from_user_name: data.from_user_name ?? 'Друг',
        from_user_avatar: data.from_user_avatar ?? '',
        room_code: data.room_code,
        anime_title: data.anime_title ?? '',
      });
      const id = data.invite_id;
      setTimeout(() => setInvites((prev) => prev.filter((i) => i.invite_id !== id)), 60000);
    });

    channel.listen('.invite.declined', (data: any) => {
      const note: DeclineNote = {
        id: `${data.room_code}-${data.at ?? Date.now()}`,
        declined_by_name: data.declined_by_name ?? 'Друг',
        anime_title: data.anime_title ?? '',
      };
      setDeclines((prev) => [...prev, note]);
      setTimeout(() => setDeclines((prev) => prev.filter((d) => d.id !== note.id)), 8000);
    });

    return () => {
      cancelled = true;
      echo.leave(`user.${user.id}`);
      echo.disconnect();
      echoRef.current = null;
    };
  }, [user?.id]);

  const removeInvite = (id: number) => setInvites((prev) => prev.filter((i) => i.invite_id !== id));

  const accept = (invite: Invite) => {
    removeInvite(invite.invite_id);
    api.post(`/watch-party/invites/${invite.invite_id}/accept`, {}).catch(() => {});
    router.push(`/watch-party/${invite.room_code}`);
  };

  const decline = (invite: Invite) => {
    removeInvite(invite.invite_id);
    api.post(`/watch-party/invites/${invite.invite_id}/decline`, {}).catch(() => {});
  };

  if (invites.length === 0 && declines.length === 0) return null;

  return (
    <div className="fixed right-4 top-20 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {invites.map((invite) => (
          <motion.div
            key={`inv-${invite.invite_id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#0d1117]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                {invite.from_user_avatar ? (
                  <img
                    src={getStorageAssetUrl(invite.from_user_avatar) || invite.from_user_avatar}
                    alt={invite.from_user_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Bell className="h-4 w-4 text-[#00E2C4]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-semibold">{invite.from_user_name}</span> приглашает вас
                </p>
                {invite.anime_title && (
                  <p className="truncate text-xs text-gray-500 dark:text-white/40">{invite.anime_title}</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => accept(invite)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#00E2C4]/40 bg-[#00E2C4]/20 px-3 py-2 text-sm font-semibold text-[#00E2C4] transition-colors hover:bg-[#00E2C4]/30"
              >
                <Check className="h-4 w-4" />
                Принять
              </button>
              <button
                onClick={() => decline(invite)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
                Отклонить
              </button>
            </div>
          </motion.div>
        ))}

        {declines.map((note) => (
          <motion.div
            key={`dec-${note.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-2xl dark:border-white/10 dark:bg-[#0d1117]"
          >
            <p className="text-sm text-gray-900 dark:text-white">
              <span className="font-semibold">{note.declined_by_name}</span> отклонил приглашение
            </p>
            {note.anime_title && (
              <p className="truncate text-xs text-gray-500 dark:text-white/40">{note.anime_title}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

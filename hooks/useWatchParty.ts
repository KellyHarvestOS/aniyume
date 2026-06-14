'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { api } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';

// Make Pusher available globally for Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

export interface Participant {
  id: number;
  name: string;
  avatar: string | null;
  is_host: boolean;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  message: string;
  type: 'message' | 'system';
  created_at: string;
}

export interface PlayerState {
  current_time: number;
  is_playing: boolean;
  episode_number: number;
  host_user_id: number;
}

interface UseWatchPartyOptions {
  roomCode: string;
  isHost: boolean;
  initialParticipants?: Participant[];
  onPlayerSync?: (state: PlayerState) => void;
  onRoomClosed?: () => void;
  onFriendInvite?: (data: any) => void;
  currentUserId?: number;
}

interface UseWatchPartyReturn {
  participants: Participant[];
  messages: ChatMessage[];
  isConnected: boolean;
  syncPlayer: (state: Omit<PlayerState, 'host_user_id'>) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  inviteFriend: (friendId: number) => Promise<void>;
  leaveRoom: () => Promise<void>;
}

export function useWatchParty({
  roomCode,
  isHost,
  initialParticipants = [],
  onPlayerSync,
  onRoomClosed,
  onFriendInvite,
  currentUserId,
}: UseWatchPartyOptions): UseWatchPartyReturn {
  const { t } = useI18n();
  const echoRef = useRef<Echo<any> | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const syncThrottleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialParticipants.length === 0) return;

    setParticipants(prev => {
      const merged = new Map<number, Participant>();
      [...initialParticipants, ...prev].forEach(participant => merged.set(participant.id, participant));
      return Array.from(merged.values());
    });
  }, [initialParticipants]);

  // Инициализация Echo
  useEffect(() => {
    if (!roomCode || typeof window === 'undefined') return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

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

    // Привязываемся к состоянию самого WebSocket-соединения (Reverb/Pusher),
    // чтобы индикатор "Подключено/Нет связи" отражал реальный сокет и
    // сам восстанавливался при реконнекте, а не зависел только от presence-колбэка.
    const connection = (echo.connector as any)?.pusher?.connection;
    const handleStateChange = (states: { current: string }) => {
      console.log('[WatchPartyHook] Socket state:', states.current);
      setIsConnected(states.current === 'connected');
    };
    if (connection) {
      setIsConnected(connection.state === 'connected');
      connection.bind('state_change', handleStateChange);
    }

    console.log('[WatchPartyHook] Joining presence channel:', `watch-party.${roomCode}`);
    // Подписка на presence канал комнаты
    const channel = echo.join(`watch-party.${roomCode}`)
      .here((users: Participant[]) => {
        console.log('[WatchPartyHook] Channel joined. Here:', users);
        setParticipants(users);
        setIsConnected(true);
      })
      .joining((user: Participant) => {
        console.log('[WatchPartyHook] User joining:', user);
        setParticipants(prev => {
          if (prev.find(p => p.id === user.id)) return prev;
          return [...prev, user];
        });
      })
      .leaving((user: Participant) => {
        console.log('[WatchPartyHook] User leaving:', user);
        setParticipants(prev => prev.filter(p => p.id !== user.id));
      })
      .listen('.player.sync', (data: PlayerState) => {
        console.log('[WatchPartyHook] Sync received:', data, 'isHost:', isHost);
        // Участники получают sync от хоста
        if (!isHost) {
          onPlayerSync?.(data);
        }
      })
      .listen('.chat.message', (data: ChatMessage) => {
        console.log('[WatchPartyHook] Chat message received:', data);
        // Не добавляем своё сообщение повторно (оно уже оптимистично добавлено)
        if (data.user_id !== currentUserId) {
          setMessages(prev => [...prev, data]);
        }
      })
      .listen('.room.closed', () => {
        console.log('[WatchPartyHook] Room closed event');
        onRoomClosed?.();
      })
      .error((error: any) => {
        // Ошибка подписки на канал не означает разрыв сокета — состояние
        // соединения отслеживается через state_change выше.
        console.error('[WatchPartyHook] Channel error:', error);
      });

    // Подписка на приватный канал для инвайтов (если есть currentUserId)
    if (currentUserId) {
      echo.private(`user.${currentUserId}`)
        .listen('.friend.invite', (data: any) => {
          onFriendInvite?.(data);
        });
    }

    return () => {
      if (connection) {
        connection.unbind('state_change', handleStateChange);
      }
      echo.leave(`watch-party.${roomCode}`);
      if (currentUserId) {
        echo.leave(`user.${currentUserId}`);
      }
      echo.disconnect();
      echoRef.current = null;
      setIsConnected(false);
    };
  }, [roomCode, isHost, currentUserId]);

  // Синхронизация плеера (только хост, с throttle 2 сек)
  const syncPlayer = useCallback(async (state: Omit<PlayerState, 'host_user_id'>) => {
    if (!isHost) return;

    if (syncThrottleRef.current) {
      clearTimeout(syncThrottleRef.current);
    }

    syncThrottleRef.current = setTimeout(async () => {
      try {
        await api.post(`/watch-party/${roomCode}/sync`, state);
      } catch (e) {
        console.error('[WatchParty] Sync error:', e);
      }
    }, 500); // Debounce 500ms
  }, [isHost, roomCode]);

  // Отправить сообщение в чат
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Оптимистичное добавление
    const optimistic: ChatMessage = {
      id: Date.now(),
      user_id: currentUserId || 0,
      user_name: t('wp.you'),
      user_avatar: null,
      message,
      type: 'message',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await api.post(`/watch-party/${roomCode}/message`, { message });
      if (!res.ok) {
        // 429 (антиспам/дубликат), 403, 422 (модерация) и т.п. — НЕ подставляем
        // тело ошибки как сообщение (у него нет user_name → краш рендера). Откатываем.
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        return;
      }
      const data = await res.json();
      // Заменяем оптимистичное сообщение реальным
      setMessages(prev => prev.map(m => m.id === optimistic.id ? { ...data } : m));
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
  }, [roomCode, currentUserId]);

  // Пригласить друга
  const inviteFriend = useCallback(async (friendId: number) => {
    try {
      await api.post(`/watch-party/${roomCode}/invite`, { friend_id: friendId });
    } catch (e) {
      console.error('[WatchParty] Invite error:', e);
    }
  }, [roomCode]);

  // Покинуть комнату
  const leaveRoom = useCallback(async () => {
    try {
      await api.post(`/watch-party/${roomCode}/leave`, {});
    } catch (e) {
      console.error('[WatchParty] Leave error:', e);
    }
  }, [roomCode]);

  return {
    participants,
    messages,
    isConnected,
    syncPlayer,
    sendMessage,
    inviteFriend,
    leaveRoom,
  };
}

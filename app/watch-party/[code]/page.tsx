'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, Link2, Users, Crown,
  LogOut, Copy, Check, Bell, Wifi, WifiOff, ChevronLeft, UserPlus
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchParty } from '@/hooks/useWatchParty';
import WatchPartyChat from '@/components/watch-party/WatchPartyChat';
import ParticipantsList from '@/components/watch-party/ParticipantsList';
import { IoPeople } from 'react-icons/io5';

interface RoomData {
  id: number;
  code: string;
  join_url: string;
  is_active: boolean;
  episode_number: number;
  current_time: number;
  is_playing: boolean;
  max_participants: number;
  anime: {
    id: number;
    title: string;
    poster_url: string;
    slug: string;
  };
  host: {
    id: number;
    name: string;
    avatar: string | null;
  };
  participants: { id: number; name: string; avatar: string | null }[];
}

export default function WatchPartyPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [room, setRoom] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSource, setActiveSource] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [showFriends, setShowFriends] = useState(false);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [sidePanel, setSidePanel] = useState<'chat' | 'participants'>('chat');
  const [friendInvitePopup, setFriendInvitePopup] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const isHost = room?.host?.id === user?.id;
  const isSyncingRef = useRef(false);

  // Virtual time reference for guests to prevent stuttering
  const hostVirtualTimeRef = useRef<{ time: number; lastUpdate: number; isPlaying: boolean; active: boolean }>({
    time: 0,
    lastUpdate: 0,
    isPlaying: false,
    active: false,
  });

  // Загрузить данные комнаты
  useEffect(() => {
    const load = async () => {
      if (!code) return;
      setIsLoading(true);
      try {
        // Join the room first
        const joinRes = await api.post(`/watch-party/${code}/join`, {});
        if (!joinRes.ok) {
          const d = await joinRes.json();
          setError(d.message || 'Не удалось войти в комнату');
          return;
        }
        const joinData = await joinRes.json();
        setRoom(joinData.room);

        // Load episode sources
        const epRes = await api.get(`/public/anime/${joinData.room.anime.id}/episodes/${joinData.room.episode_number}/sources`);
        if (epRes.ok) {
          const epData = await epRes.json();
          if (epData?.data?.sources?.length > 0) {
            setActiveSource(epData.data.sources[0]);
          } else {
            setActiveSource({ type: 'iframe', url: epData?.player_url || '' });
          }
        }
      } catch {
        setError('Ошибка загрузки комнаты');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [code]);

  // Загрузить друзей (для инвайтов)
  useEffect(() => {
    if (!user) return;
    api.get('/friends').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setFriends(d);
    }).catch(() => { });
  }, [user]);

  // Загрузить историю чата
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  useEffect(() => {
    if (!code) return;
    api.get(`/watch-party/${code}/messages`).then(r => r.json()).then(d => {
      if (Array.isArray(d)) setInitialMessages(d);
    }).catch(() => { });
  }, [code]);

  // WebSocket через useWatchParty
  const {
    participants,
    messages: wsMessages,
    isConnected,
    syncPlayer,
    sendMessage,
    inviteFriend,
    leaveRoom,
  } = useWatchParty({
    roomCode: code as string,
    isHost,
    currentUserId: user?.id,
    onPlayerSync: (state) => {
      if (!isHost && videoRef.current) {
        const v = videoRef.current;
        isSyncingRef.current = true;

        // Update virtual clock ref
        hostVirtualTimeRef.current = {
          time: state.current_time,
          lastUpdate: window.performance.now(),
          isPlaying: state.is_playing,
          active: true,
        };

        // Sync play state immediately
        if (state.is_playing && v.paused) {
          // Агрессивное слияние (Aggressive Merge): 
          // Пробрасываем гостя на +250мс вперед, чтобы с первой секунды воспроизведения 
          // нивелировать время пересылки пакета по сети (Пинг) и слиться звуком идеально.
          v.currentTime = state.current_time + 1.5;
          v.play().catch(() => { });
        } else if (!state.is_playing && !v.paused) {
          v.pause();
        }

        // Hard seek ONLY if severely out of sync (e.g. buffered/lagged > 3 seconds)
        // Fine <3s sync is handled by the slewing (playbackRate) loop below
        if (Math.abs(v.currentTime - state.current_time) > 3) {
          v.currentTime = state.is_playing ? state.current_time + 0.25 : state.current_time;
        }

        setTimeout(() => { isSyncingRef.current = false; }, 300);
      }
    },
    onRoomClosed: () => {
      setError('Хост закрыл комнату');
      setTimeout(() => router.push('/'), 3000);
    },
    onFriendInvite: (data) => {
      setFriendInvitePopup(data);
      setTimeout(() => setFriendInvitePopup(null), 8000);
    },
  });

  // Объединяем начальные сообщения с WebSocket
  const allMessages = [...initialMessages, ...wsMessages].filter(
    (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
  );

  const handleLeave = async () => {
    await leaveRoom();
    router.push(room ? `/anime/${room.anime.slug}` : '/');
  };

  const copyLink = () => {
    const url = `${window.location.origin}/watch-party/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (friendId: number) => {
    await inviteFriend(friendId);
    setInvitedIds(prev => [...prev, friendId]);
  };

  // Virtual Clock & Slewing Sync Loop (Guest-only)
  useEffect(() => {
    if (isHost || !videoRef.current) return;

    let frameId: number;
    const loop = (now: number) => {
      const v = videoRef.current;
      const hostData = hostVirtualTimeRef.current;

      if (v && hostData.active && !v.paused && hostData.isPlaying) {
        // Прогнозируем время хоста
        const elapsedSeconds = (now - hostData.lastUpdate) / 1000;
        const expectedTime = hostData.time + elapsedSeconds;
        const drift = expectedTime - v.currentTime;

        // Нормализация скорости (если рассинхрон огромный, ждем хард-сика)
        if (Math.abs(drift) > 3) {
          v.playbackRate = 1.0;
        } else if (drift > 0.05) {
          // Гость отстает больше чем на 50мс -> немного ускоряем
          v.playbackRate = 1.05;
        } else if (drift < -0.05) {
          // Гость спешит больше чем на 50мс -> немного замедляем
          v.playbackRate = 0.95;
        } else {
          // Идеальная синхронизация (<50мс)
          v.playbackRate = 1.0;
        }
      } else if (v && !hostData.isPlaying) {
        // Защита от зависания скорости, если видео на паузе
        v.playbackRate = 1.0;
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isHost]);

  // HLS logic
  useEffect(() => {
    if (!activeSource || activeSource.type !== 'hls' || !activeSource.url || !videoRef.current) {
      console.log('[WatchParty] HLS not ready or not hls type', { activeSource, hasVideoRef: !!videoRef.current });
      return;
    }

    console.log('[WatchParty] Initializing HLS with URL:', activeSource.url);
    let isSubscribed = true;
    const initHls = async () => {
      const Hls = (await import('hls.js')).default;
      if (!isSubscribed) return;

      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: true, debug: false });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('[WatchParty] HLS Fatal Error:', data.type, data.details, data);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('[WatchParty] fatal network error encountered, try to recover');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('[WatchParty] fatal media error encountered, try to recover');
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          } else {
            console.warn('[WatchParty] HLS Non-fatal Error:', data.type, data.details);
          }
        });

        hlsRef.current = hls;
        const cleanUrl = activeSource.url.replace(/&?(isWithVideoAds|isWithVideoAdsAlways)=1/g, '');
        console.log('[WatchParty] Cleaned HLS URL:', cleanUrl);
        hls.loadSource(cleanUrl);
        hls.attachMedia(videoRef.current!);
      } else if (videoRef.current!.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('[WatchParty] Native HLS supported');
        const cleanUrl = activeSource.url.replace(/&?(isWithVideoAds|isWithVideoAdsAlways)=1/g, '');
        videoRef.current!.src = cleanUrl;
      }
    };
    initHls();

    return () => {
      isSubscribed = false;
      if (hlsRef.current) {
        console.log('[WatchParty] Destroying HLS instance');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeSource]);

  // Host: sync events
  const handleHostPlay = () => {
    if (isHost && videoRef.current && !isSyncingRef.current) {
      console.log('[WatchParty] Host triggered PLAY', videoRef.current.currentTime);
      syncPlayer({ current_time: videoRef.current.currentTime, is_playing: true, episode_number: room?.episode_number || 1 });
    }
  };
  const handleHostPause = () => {
    if (isHost && videoRef.current && !isSyncingRef.current) {
      console.log('[WatchParty] Host triggered PAUSE', videoRef.current.currentTime);
      syncPlayer({ current_time: videoRef.current.currentTime, is_playing: false, episode_number: room?.episode_number || 1 });
    }
  };
  const handleHostSeeked = () => {
    if (isHost && videoRef.current && !isSyncingRef.current) {
      console.log('[WatchParty] Host triggered SEEKED', videoRef.current.currentTime);
      syncPlayer({ current_time: videoRef.current.currentTime, is_playing: !videoRef.current.paused, episode_number: room?.episode_number || 1 });
    }
  };

  // Periodic host sync (every 5 seconds) to ensure guests don't drift
  useEffect(() => {
    if (!isHost) return;
    const interval = setInterval(() => {
      if (videoRef.current) {
        console.log('[WatchParty] Host 5-sec heartbeat sync', videoRef.current.currentTime, !videoRef.current.paused);
        syncPlayer({
          current_time: videoRef.current.currentTime,
          is_playing: !videoRef.current.paused,
          episode_number: room?.episode_number || 1
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHost, syncPlayer, room]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center transition-colors">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#00E2C4]/30 border-t-[#00E2C4] animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-white/50">Подключение к комнате...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center transition-colors">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button onClick={() => router.push('/')} className="text-[#00E2C4] hover:underline">
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 dark:bg-[#111111] dark:text-gray-200 flex flex-col transition-colors">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={handleLeave}
            className="flex shrink-0 items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:text-white/50 dark:hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Выйти
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />

          {/* Room Info */}
          <div className="flex min-w-0 items-center gap-2">
            {room.anime.poster_url && (
              <img src={room.anime.poster_url} alt="" className="hidden xs:block w-6 h-8 object-cover rounded" />
            )}
            <div className="min-w-0">
              <p className="max-w-[150px] truncate text-sm font-semibold text-gray-900 dark:text-white leading-tight sm:max-w-[260px] md:max-w-[360px]">{room.anime.title}</p>
              <p className="text-xs text-gray-500 dark:text-white/40">Эпизод {room.episode_number}</p>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Connection Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Подключено' : 'Нет связи'}
          </div>

          {/* Code Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-white/50">Код:</span>
            <span className="text-sm font-mono font-bold text-[#00E2C4] tracking-widest">{room.code}</span>
          </div>

          {/* Copy Link */}
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-[#00E2C4]" /> : <Link2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Скопировано!' : 'Ссылка'}</span>
          </button>

          {/* Invite Friends */}
          <button
            onClick={() => setShowFriends(!showFriends)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Друзья</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Player */}
        <div className="relative flex aspect-video min-h-[220px] flex-none flex-col bg-black sm:min-h-[360px] lg:aspect-auto lg:min-h-0 lg:flex-1">
          {activeSource ? (
            activeSource.type === 'hls' ? (
              <video
                ref={videoRef}
                className="h-full w-full bg-black outline-none"
                controls={isHost}
                playsInline
                onPlay={handleHostPlay}
                onPause={handleHostPause}
                onSeeked={handleHostSeeked}
                onError={(e) => e.stopPropagation()}
                onAbort={(e) => e.stopPropagation()}
              />
            ) : (
              <iframe
                src={activeSource.url?.startsWith('//') ? `https:${activeSource.url}` : activeSource.url}
                className="block h-full w-full bg-black"
                allowFullScreen
                allow="autoplay; fullscreen"
                style={{ border: 'none' }}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/40 text-sm">Плеер загружается...</p>
              </div>
            </div>
          )}

          {/* Host badge */}
          {isHost && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[11px] sm:text-xs font-medium">
              <Crown className="w-3 h-3" />
              Вы хост — управляете воспроизведением
            </div>
          )}

          {/* Friend Invite Popup */}
          <AnimatePresence>
            {friendInvitePopup && (
              <motion.div
                initial={{ opacity: 0, y: 20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 20, x: '-50%' }}
                className="absolute bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-sm bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#00E2C4]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {friendInvitePopup.from_user_name} приглашает вас
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/40">{friendInvitePopup.anime_title}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push(`/watch-party/${friendInvitePopup.room_code}`);
                      setFriendInvitePopup(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#00E2C4]/20 border border-[#00E2C4]/40 text-[#00E2C4] text-xs font-semibold hover:bg-[#00E2C4]/30 transition-colors"
                  >
                    Войти
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="flex h-[420px] w-full flex-col border-t border-gray-200 bg-white dark:border-white/5 dark:bg-[#0d0d0d] sm:h-[460px] lg:h-auto lg:w-80 lg:border-l lg:border-t-0 lg:bg-black/20 lg:dark:bg-black/20">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-white/10">
            {([
              { id: 'chat', label: 'Чат', icon: null },
              { id: 'participants', label: `${participants.length}`, icon: <IoPeople className="h-4 w-4" /> },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setSidePanel(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${sidePanel === tab.id
                  ? 'text-[#00E2C4] border-b-2 border-[#00E2C4]'
                  : 'text-gray-400 hover:text-gray-700 dark:text-white/40 dark:hover:text-white'
                  }`}
              >
                <span className="inline-flex items-center justify-center gap-1.5">{tab.icon}{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden p-3">
            {sidePanel === 'chat' ? (
              <WatchPartyChat
                messages={allMessages}
                onSend={sendMessage}
                currentUserId={user?.id}
                className="h-full"
              />
            ) : (
              <ParticipantsList
                participants={participants}
                hostId={room.host.id}
                currentUserId={user?.id}
                maxParticipants={room.max_participants}
              />
            )}
          </div>
        </div>
      </div>

      {/* Friends Dropdown */}
      <AnimatePresence>
        {showFriends && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-20 right-3 z-50 w-[calc(100vw-1.5rem)] max-w-72 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden sm:top-14 sm:right-4"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Пригласить друзей</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {friends.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-white/30 text-sm py-6">Нет друзей для приглашения</p>
              ) : (
                friends.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10">
                      {f.avatar ? (
                        <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-white/50">
                          {f.name[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{f.name}</p>
                      {f.is_online && <p className="text-[10px] text-green-400">В сети</p>}
                    </div>
                    <button
                      onClick={() => handleInvite(f.id)}
                      disabled={invitedIds.includes(f.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${invitedIds.includes(f.id)
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-[#00E2C4]/20 border border-[#00E2C4]/40 text-[#00E2C4] hover:bg-[#00E2C4]/30'
                        }`}
                    >
                      {invitedIds.includes(f.id) ? '✓ Отправлено' : 'Пригласить'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

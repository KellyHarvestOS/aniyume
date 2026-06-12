'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, UserPlus, UserCheck, UserX, Clock, Check, X, Tv2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import JoinRoomModal from '@/components/watch-party/JoinRoomModal';
import { getStorageAssetUrl } from '@/lib/storage';

interface FriendUser {
  id: number;
  name: string;
  avatar: string | null;
  custom_status: string | null;
  is_online: boolean;
}

type FriendStatus = 'none' | 'pending' | 'accepted';

interface SearchUser extends FriendUser {
  friendship_status?: FriendStatus;
  is_sender?: boolean;
}

interface FriendProfile {
  user: SearchUser & {
    is_premium?: boolean;
    created_at?: string | null;
  };
  counts: {
    friends: number;
    comments: number;
    ratings: number;
    favorites: number;
  };
}

export default function FriendsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const profileRequestSeq = useRef(0);

  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [incoming, setIncoming] = useState<FriendUser[]>([]);
  const [outgoing, setOutgoing] = useState<FriendUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<FriendProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingNickname, setIsSendingNickname] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        api.get('/friends').then(r => r.json()),
        api.get('/friends/requests').then(r => r.json()),
      ]);
      if (Array.isArray(friendsRes)) setFriends(friendsRes);
      if (requestsRes?.incoming) setIncoming(requestsRes.incoming);
      if (requestsRes?.outgoing) setOutgoing(requestsRes.outgoing);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Поиск пользователей с debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (Array.isArray(data)) setSearchResults(data);
      } catch {
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const setLoading = (id: number, val: boolean) => {
    setLoadingIds(prev => val ? [...prev, id] : prev.filter(x => x !== id));
  };

  const responseError = async (res: Response, fallback: string) => {
    const data = await res.json().catch(() => ({}));
    return data?.message || fallback;
  };

  const sendRequest = async (userId: number) => {
    setLoading(userId, true);
    try {
      const res = await api.post(`/friends/${userId}`, {});
      if (!res.ok) throw new Error(await responseError(res, 'Не удалось отправить запрос'));
      const found = searchResults.find(u => u.id === userId);
      if (found) setOutgoing(prev => prev.some(u => u.id === userId) ? prev : [...prev, found]);
      setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'pending', is_sender: true } : u));
    } finally {
      setLoading(userId, false);
    }
  };

  const sendRequestByNickname = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = nickname.trim();
    if (!value) return;

    setIsSendingNickname(true);
    setNicknameError('');
    try {
      const res = await api.post('/friends/by-nickname', { nickname: value });
      if (!res.ok) throw new Error(await responseError(res, 'Не удалось отправить запрос'));
      setNickname('');
      setSearchQuery(value);
      setActiveTab('requests');
      await loadData();
    } catch (err) {
      setNicknameError(err instanceof Error ? err.message : 'Не удалось отправить запрос');
    } finally {
      setIsSendingNickname(false);
    }
  };

  const acceptRequest = async (userId: number) => {
    setLoading(userId, true);
    try {
      const res = await api.post(`/friends/${userId}/accept`, {});
      if (!res.ok) throw new Error(await responseError(res, 'Не удалось принять заявку'));
      const accepted = incoming.find(u => u.id === userId);
      if (accepted) {
        setFriends(prev => prev.some(u => u.id === userId) ? prev : [...prev, accepted]);
        setIncoming(prev => prev.filter(u => u.id !== userId));
      }
      setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'accepted', is_sender: false } : u));
    } finally {
      setLoading(userId, false);
    }
  };

  const declineRequest = async (userId: number) => {
    setLoading(userId, true);
    try {
      const res = await api.post(`/friends/${userId}/decline`, {});
      if (!res.ok) throw new Error(await responseError(res, 'Не удалось удалить заявку'));
      setIncoming(prev => prev.filter(u => u.id !== userId));
      setFriends(prev => prev.filter(u => u.id !== userId));
      setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'none', is_sender: false } : u));
    } finally {
      setLoading(userId, false);
    }
  };

  const cancelOutgoing = async (userId: number) => {
    setLoading(userId, true);
    try {
      const res = await api.post(`/friends/${userId}/decline`, {});
      if (!res.ok) throw new Error(await responseError(res, 'Не удалось отменить заявку'));
      setOutgoing(prev => prev.filter(u => u.id !== userId));
      setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'none', is_sender: false } : u));
    } finally {
      setLoading(userId, false);
    }
  };

  const openProfile = async (userId: number) => {
    const requestSeq = profileRequestSeq.current + 1;
    profileRequestSeq.current = requestSeq;
    setIsProfileLoading(true);
    try {
      const res = await api.get(`/users/${userId}/profile`);
      const data = await res.json();
      if (res.ok && profileRequestSeq.current === requestSeq) setSelectedProfile(data);
    } finally {
      if (profileRequestSeq.current === requestSeq) setIsProfileLoading(false);
    }
  };

  const closeProfile = () => {
    profileRequestSeq.current += 1;
    setSelectedProfile(null);
    setIsProfileLoading(false);
  };

  const tabs = [
    { id: 'friends' as const, label: 'Друзья', count: friends.length },
    { id: 'requests' as const, label: 'Заявки', count: incoming.length },
    { id: 'search' as const, label: 'Поиск', count: null },
  ];

  const UserAvatar = ({ user, size = 10 }: { user: FriendUser | SearchUser; size?: number }) => {
    const sizeClass = size === 16 ? 'w-16 h-16' : size === 12 ? 'w-12 h-12' : 'w-10 h-10';

    return (
      <div className={`relative flex-shrink-0 ${sizeClass}`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
          {user.avatar ? (
            <img src={getStorageAssetUrl(user.avatar) || user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base font-bold text-white/60">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
        </div>
        {user.is_online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#070b14]" />
        )}
      </div>
    );
  };

  const ProfileModal = () => (
    <AnimatePresence>
      {(selectedProfile || isProfileLoading) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeProfile} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 16 }} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#070b14] shadow-2xl overflow-hidden">
            <button type="button" onClick={closeProfile} className="absolute right-4 top-4 z-10 w-10 h-10 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
            {isProfileLoading && !selectedProfile ? (
              <div className="p-14 flex justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#00E2C4]/25 border-t-[#00E2C4] animate-spin" />
              </div>
            ) : selectedProfile ? (
              <div className="p-8">
                <div className="flex flex-col items-center text-center">
                  <UserAvatar user={selectedProfile.user} size={16} />
                  <h2 className="mt-5 text-2xl font-bold text-white">{selectedProfile.user.name}</h2>
                  <p className={`mt-1 text-sm ${selectedProfile.user.is_online ? 'text-green-400' : 'text-white/40'}`}>
                    {selectedProfile.user.custom_status || (selectedProfile.user.is_online ? 'В сети' : 'Не в сети')}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-8">
                  <div className="rounded-2xl bg-white/5 p-3 text-center"><p className="text-[#00E2C4] font-bold">{selectedProfile.counts.friends}</p><p className="text-[10px] text-white/35">друзья</p></div>
                  <div className="rounded-2xl bg-white/5 p-3 text-center"><p className="text-[#00E2C4] font-bold">{selectedProfile.counts.comments}</p><p className="text-[10px] text-white/35">комм.</p></div>
                  <div className="rounded-2xl bg-white/5 p-3 text-center"><p className="text-[#00E2C4] font-bold">{selectedProfile.counts.ratings}</p><p className="text-[10px] text-white/35">оценки</p></div>
                  <div className="rounded-2xl bg-white/5 p-3 text-center"><p className="text-[#00E2C4] font-bold">{selectedProfile.counts.favorites}</p><p className="text-[10px] text-white/35">избр.</p></div>
                </div>
                <p className="mt-6 text-center text-xs uppercase tracking-wider text-white/35">
                  {selectedProfile.user.friendship_status === 'accepted' ? 'У вас в друзьях' : selectedProfile.user.friendship_status === 'pending' ? 'Заявка ожидает ответа' : 'Не в друзьях'}
                </p>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#070b14] pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Друзья</h1>
              <p className="text-white/40 text-sm mt-1">
                {friends.length > 0 ? `${friends.filter(f => f.is_online).length} онлайн из ${friends.length}` : 'Найдите друзей по имени'}
              </p>
            </div>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E2C4]/10 border border-[#00E2C4]/30 text-[#00E2C4] text-sm font-medium hover:bg-[#00E2C4]/20 transition-colors"
            >
              <Tv2 className="w-4 h-4" />
              Войти в комнату
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  tab.id === 'requests' ? 'bg-[#00E2C4] text-black' : 'bg-white/20 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))
              ) : friends.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40">Пока нет друзей</p>
                  <button onClick={() => setActiveTab('search')} className="text-[#00E2C4] text-sm hover:underline">
                    Найти пользователей
                  </button>
                </div>
              ) : (
                friends.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 hover:border-white/10 transition-all group"
                  >
                    <button type="button" onClick={() => openProfile(f.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <UserAvatar user={f} size={10} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{f.name}</p>
                        <p className={`text-xs truncate ${f.is_online ? 'text-green-400' : 'text-white/30'}`}>
                          {f.is_online ? 'В сети' : f.custom_status || 'Не в сети'}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => declineRequest(f.id)}
                        disabled={loadingIds.includes(f.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Удалить
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {incoming.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Входящие</p>
                  <div className="space-y-2">
                    {incoming.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-[#00E2C4]/10">
                        <button type="button" onClick={() => openProfile(f.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                          <UserAvatar user={f} size={10} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{f.name}</p>
                            <p className="text-xs text-white/40 truncate">Хочет добавить вас в друзья</p>
                          </div>
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptRequest(f.id)}
                            disabled={loadingIds.includes(f.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00E2C4]/20 border border-[#00E2C4]/40 text-[#00E2C4] text-xs font-semibold hover:bg-[#00E2C4]/30 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => declineRequest(f.id)}
                            disabled={loadingIds.includes(f.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {outgoing.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Исходящие</p>
                  <div className="space-y-2">
                    {outgoing.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                        <button type="button" onClick={() => openProfile(f.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                          <UserAvatar user={f} size={10} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{f.name}</p>
                            <p className="text-xs text-white/40 truncate">Ожидание ответа</p>
                          </div>
                        </button>
                        <button
                          onClick={() => cancelOutgoing(f.id)}
                          disabled={loadingIds.includes(f.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:text-white hover:border-white/20 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Отменить
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {incoming.length === 0 && outgoing.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                    <UserPlus className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40">Нет активных заявок</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <form onSubmit={sendRequestByNickname} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="Точное имя для заявки..."
                      className="w-full pl-10 pr-4 py-3 bg-black/10 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-[#00E2C4]/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingNickname || !nickname.trim()}
                    className="px-4 py-3 rounded-xl bg-[#00E2C4]/20 border border-[#00E2C4]/40 text-[#00E2C4] text-xs font-semibold hover:bg-[#00E2C4]/30 transition-colors disabled:opacity-50"
                  >
                    {isSendingNickname ? '...' : 'Отправить'}
                  </button>
                </div>
                {nicknameError ? <p className="mt-2 text-xs text-red-400">{nicknameError}</p> : null}
              </form>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск пользователей по имени..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-[#00E2C4]/50 transition-colors"
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#00E2C4]/30 border-t-[#00E2C4] animate-spin" />
                )}
              </div>

              <div className="space-y-2">
                {searchResults.map((u, i) => {
                  const isFriend = friends.some(f => f.id === u.id);
                  const isPendingOutgoing = outgoing.some(f => f.id === u.id)
                    || (u.friendship_status === 'pending' && u.is_sender);
                  const isPendingIncoming = incoming.some(f => f.id === u.id);

                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <button type="button" onClick={() => openProfile(u.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <UserAvatar user={u} size={10} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{u.name}</p>
                          <p className={`text-xs truncate ${u.is_online ? 'text-green-400' : 'text-white/30'}`}>
                            {u.is_online ? 'В сети' : u.custom_status || 'Не в сети'}
                          </p>
                        </div>
                      </button>

                      {/* Action Button */}
                      {isFriend ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs">
                          <UserCheck className="w-3.5 h-3.5" />
                          Друзья
                        </span>
                      ) : isPendingOutgoing ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          Отправлено
                        </span>
                      ) : isPendingIncoming ? (
                        <button
                          onClick={() => acceptRequest(u.id)}
                          disabled={loadingIds.includes(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E2C4]/20 border border-[#00E2C4]/40 text-[#00E2C4] text-xs font-semibold hover:bg-[#00E2C4]/30 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Принять
                        </button>
                      ) : (
                        <button
                          onClick={() => sendRequest(u.id)}
                          disabled={loadingIds.includes(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {loadingIds.includes(u.id) ? (
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin" />
                          ) : (
                            <UserPlus className="w-3.5 h-3.5" />
                          )}
                          Добавить
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <p className="text-center text-white/30 py-8 text-sm">Пользователи не найдены</p>
                )}
                {searchQuery.length < 2 && (
                  <p className="text-center text-white/20 py-8 text-sm">Введите минимум 2 символа</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProfileModal />
      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} />}
    </div>
  );
}

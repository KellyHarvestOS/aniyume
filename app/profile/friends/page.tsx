'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaUsers, FaChartLine, FaSearch, FaTimes, FaClock } from 'react-icons/fa';
import AddFriendModal from '@/components/modals/AddFriendModal';
import FriendRequestsModal from '@/components/modals/FriendRequestsModal';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageAssetUrl } from '@/lib/storage';

interface FriendUser {
    id: number;
    name: string;
    avatar: string | null;
    custom_status: string | null;
    is_online: boolean;
    watching?: string;
    progress?: number;
}

type FriendStatus = 'none' | 'pending' | 'accepted';

interface SearchUser extends FriendUser {
    friendship_status?: FriendStatus;
    is_sender?: boolean;
}

export default function FriendsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // API States
    const [friends, setFriends] = useState<FriendUser[]>([]);
    const [incoming, setIncoming] = useState<FriendUser[]>([]);
    const [outgoing, setOutgoing] = useState<FriendUser[]>([]);
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const setLoading = (id: number, val: boolean) => {
        setLoadingIds(prev => val ? [...prev, id] : prev.filter(x => x !== id));
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
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
            } catch (err) {
                console.error("Failed to load friends", err);
            } finally {
                setIsLoading(false);
            }
        };

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

    const sendRequest = async (userId: number) => {
        setLoading(userId, true);
        try {
            await api.post(`/friends/${userId}`, {});
            setOutgoing(prev => [...prev, searchResults.find(u => u.id === userId)!].filter(Boolean));
            setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: 'pending', is_sender: true } : u));
        } finally {
            setLoading(userId, false);
        }
    };

    const acceptRequest = async (userId: number) => {
        setLoading(userId, true);
        try {
            await api.post(`/friends/${userId}/accept`, {});
            const accepted = incoming.find(u => u.id === userId);
            if (accepted) {
                setFriends(prev => [...prev, accepted]);
                setIncoming(prev => prev.filter(u => u.id !== userId));
            }
        } finally {
            setLoading(userId, false);
        }
    };

    const declineRequest = async (userId: number) => {
        setLoading(userId, true);
        try {
            await api.post(`/friends/${userId}/decline`, {});
            setIncoming(prev => prev.filter(u => u.id !== userId));
            setFriends(prev => prev.filter(u => u.id !== userId));
        } finally {
            setLoading(userId, false);
        }
    };

    const cancelOutgoing = async (userId: number) => {
        setLoading(userId, true);
        try {
            await api.post(`/friends/${userId}/decline`, {});
            setOutgoing(prev => prev.filter(u => u.id !== userId));
        } finally {
            setLoading(userId, false);
        }
    };

    const getAvatar = (u: FriendUser | SearchUser) => {
        if (u.avatar) {
            return getStorageAssetUrl(u.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
        }
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
    };

    const isSearchMode = searchQuery.length >= 2;
    const gridItems = isSearchMode ? searchResults : friends;

    return (
        <div className="min-h-screen bg-white dark:bg-[#111111] transition-colors pb-12 overflow-hidden relative">
            <style jsx>{`
                .custom-glass {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
                }

                .dark .custom-glass {
                    background: rgba(20, 20, 20, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 6px;
                }

                .progress-bar {
                    height: 3px;
                    background: rgba(var(--brand-main-rgb, 33 208 184) / 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .search-input:focus + .search-line {
                    width: 100%;
                }
            `}</style>

            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="goo-local">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                    </filter>
                </defs>
            </svg>

            <div className="container mx-auto px-4 md:px-20 pt-5 mb-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-5">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
                            {isSearchMode ? 'Поиск ' : 'Мои '} <span className="text-brand">{isSearchMode ? 'Людей' : 'Друзья'}</span>
                        </h1>
                        <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] ml-1">
                            {friends.filter(f => f.is_online).length} ОНЛАЙН • {friends.length} ВСЕГО
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Кнопка входящих заявок с счётчиком */}
                        <button
                            onClick={() => setIsRequestModalOpen(true)}
                            className="relative w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand border border-transparent hover:border-brand-simple transition-all group shadow-inner"
                        >
                            <FaUsers size={20} className="group-hover:text-brand transition-colors" />

                            {incoming.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-[#111111] shadow-lg animate-bounce">
                                    {incoming.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brand text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter text-xs hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
                        >
                            <FaPlus size={10} /> Добавить по ID
                        </button>
                    </div>
                </div>

                <div className="mt-5 relative max-w-md group rounded-xl">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-5 text-brand">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ПОИСК ПО ИМЕНИ ИЛИ ID..."
                        className="w-full bg-transparent pt-4 pb-3 pl-12 pr-10 text-sm font-black uppercase italic tracking-widest text-gray-900 dark:text-white border-2 rounded-xl border-gray-100 dark:border-white/10 outline-none transition-all placeholder:text-gray-500 focus:border-brand"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                    {isSearching && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
                    )}
                    <div className="search-line absolute bottom-0 left-0 h-0.5 w-0 bg-brand transition-all duration-500" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {/* Входящие заявки (не в режиме поиска) */}
                    {!isSearchMode && incoming.map((u) => (
                        <motion.div
                            layout
                            key={`incoming-${u.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="custom-glass rounded-lg p-8 border-2 border-brand/50 shadow-[0_0_15px_rgba(var(--brand-main-rgb,33_208_184)/0.15)] transition-all duration-300 relative group bg-brand/5"
                        >
                            <div className="absolute top-4 left-0 w-full text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand">Новая заявка</span>
                            </div>

                            <div className="flex flex-col items-center mt-6">
                                <div className="w-24 h-24 rounded-full border-2 border-brand/30 p-1.5 mb-6">
                                    <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6">
                                    {u.name}
                                </h3>

                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => acceptRequest(u.id)}
                                        disabled={loadingIds.includes(u.id)}
                                        className="flex-1 h-10 bg-brand hover:brightness-110 text-white rounded-xl shadow-lg font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                        Принять
                                    </button>
                                    <button
                                        onClick={() => declineRequest(u.id)}
                                        disabled={loadingIds.includes(u.id)}
                                        className="flex-1 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                        Скрыть
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Исходящие заявки (не в режиме поиска) */}
                    {!isSearchMode && outgoing.map((u) => (
                        <motion.div
                            layout
                            key={`outgoing-${u.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="custom-glass rounded-lg p-8 border border-white/10 transition-all duration-300 relative group opacity-60"
                        >
                            <div className="absolute top-4 left-0 w-full text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ожидает ответа</span>
                            </div>

                            <div className="flex flex-col items-center mt-6">
                                <div className="w-24 h-24 rounded-full border border-gray-400/30 p-1.5 mb-6 grayscale">
                                    <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-500 mb-6">
                                    {u.name}
                                </h3>

                                <button
                                    onClick={() => cancelOutgoing(u.id)}
                                    disabled={loadingIds.includes(u.id)}
                                    className="w-full h-10 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                    Отменить заявку
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Основная сетка: друзья или результаты поиска */}
                    {isLoading && !isSearchMode ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-12 h-12 rounded-full border-4 border-brand/30 border-t-brand animate-spin mx-auto" />
                        </div>
                    ) : gridItems.length > 0 ? (
                        gridItems.map((u) => {
                            const isSearchItem = 'friendship_status' in u;

                            let actionButton = null;

                            if (isSearchItem) {
                                const searchUser = u as SearchUser;
                                const isFriend = friends.some(f => f.id === u.id);
                                const isPendingOutgoing = outgoing.some(f => f.id === u.id) || (searchUser.friendship_status === 'pending' && searchUser.is_sender);
                                const isPendingIncoming = incoming.some(f => f.id === u.id);

                                if (isFriend) {
                                    actionButton = (
                                        <button className="w-full h-12 bg-white/5 text-emerald-400 rounded-2xl font-bold text-xs italic tracking-widest cursor-default">
                                            УЖЕ В ДРУЗЬЯХ
                                        </button>
                                    );
                                } else if (isPendingIncoming) {
                                    actionButton = (
                                        <button onClick={() => acceptRequest(u.id)} className="w-full h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/30 transition-all">
                                            ПРИНЯТЬ ЗАЯВКУ
                                        </button>
                                    );
                                } else if (isPendingOutgoing) {
                                    actionButton = (
                                        <button className="w-full h-12 bg-white/5 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-default flex items-center justify-center gap-2">
                                            <FaClock /> ЗАЯВКА ОТПРАВЛЕНА
                                        </button>
                                    );
                                } else {
                                    actionButton = (
                                        <button
                                            onClick={() => sendRequest(u.id)}
                                            disabled={loadingIds.includes(u.id)}
                                            className="w-full h-12 bg-transparent border-2 border-brand text-brand hover:bg-brand hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                                            ДОБАВИТЬ
                                        </button>
                                    );
                                }
                            } else {
                                // Друг — кнопка Watch Party
                                actionButton = (
                                    <button
                                        onClick={() => router.push('/watch')}
                                        className="w-full h-[54px] bg-brand text-white dark:text-black rounded-2xl relative overflow-hidden transition-all active:scale-95 shadow-lg shadow-brand/10 hover:brightness-110 flex items-center justify-center gap-3"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] italic">
                                            <FaPlay size={8} className="fill-current" /> Пригласить
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <motion.div
                                    layout
                                    key={u.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -8 }}
                                    className="custom-glass rounded-lg p-8 border border-white/5 hover:border-brand/30 transition-all duration-300 relative group"
                                >
                                    <div className="absolute top-8 left-8">
                                        <span className="text-[9px] font-black text-gray-500 dark:text-white/20">ID: {u.id}</span>
                                    </div>

                                    <div className="absolute top-8 right-8 flex items-center">
                                        <span className={`status-dot ${u.is_online ? 'bg-brand' : 'bg-gray-400'}`} />
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                                            {u.is_online ? 'В сети' : (u.custom_status || 'Оффлайн')}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full border border-gray-100 dark:border-white/5 p-1.5 mb-6">
                                            <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                        </div>

                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-2 group-hover:text-brand transition-colors">
                                            {u.name}
                                        </h3>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <FaChartLine size={10} />
                                                <span className="text-[10px] font-bold">УР 1</span>
                                            </div>
                                            <div className="w-1 h-1 bg-gray-300 dark:bg-white/10 rounded-full" />
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <FaUsers size={10} />
                                                <span className="text-[10px] font-bold">Активен</span>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3 mb-10 h-10">
                                            {u.watching ? (
                                                <>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Смотрит</p>
                                                        <p className="text-[10px] font-black text-brand">{u.progress || 0}%</p>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 italic truncate">
                                                        {u.watching}
                                                    </p>
                                                    <div className="progress-bar">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${u.progress || 0}%` }}
                                                            className="h-full bg-brand"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-center text-gray-500 italic pt-3 font-medium">Ничего не смотрит</p>
                                            )}
                                        </div>

                                        {actionButton}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center"
                        >
                            <p className="text-2xl font-black uppercase italic text-gray-400 tracking-tighter">
                                {isSearchMode ? 'По вашему запросу ' : 'У вас пока нет '} <span className="text-brand">{isSearchMode ? 'ничего не найдено' : 'друзей'}</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full pointer-events-none -z-10" />

            <AddFriendModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <FriendRequestsModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </div>
    );
}

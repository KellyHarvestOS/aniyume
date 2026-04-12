'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaUsers, FaChartLine, FaSearch, FaTimes, FaCheck, FaTimes as FaCancel, FaClock } from 'react-icons/fa';
import AddFriendModal from '@/components/modals/AddFriendModal';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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

    // Helper functions for UI mapping
    const getAvatar = (user: FriendUser | SearchUser) => {
        if (user.avatar) {
            // Если аватар локальный, пропускаем через proxy
            if (!user.avatar.startsWith('http') && !user.avatar.startsWith('//')) {
                return `/api-storage/${user.avatar.replace(/^\//, '')}`;
            }
            return user.avatar;
        }
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
    };

    // Determine what array to render in the grid
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

                .lava-wrap {
                    filter: url('#goo-local');
                    position: absolute;
                    inset: 0;
                    background: #21D0B8;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                .btn-premium:hover .lava-wrap {
                    opacity: 1;
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
                    background: rgba(33, 208, 200, 0.1);
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
                            {isSearchMode ? 'Поиск ' : 'Мои '} <span className="text-[#21D0B8]">{isSearchMode ? 'Людей' : 'Друзья'}</span>
                        </h1>
                        <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] ml-1">
                            {friends.filter(f => f.is_online).length} ОНЛАЙН • {friends.length} ВСЕГО
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#21D0B8] text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter text-xs hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-[#21D0B8]/20 flex items-center justify-center gap-2">
                            <FaPlus size={10} /> Добавить по ID
                        </button>
                    </div>
                </div>

                <div className="mt-5 relative max-w-md group rounded-xl">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-5 text-[#21D0B8]">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ПОИСК ПО ИМЕНИ..."
                        className=" w-full bg-transparent pt-4 pb-3 pl-12 pr-10 text-sm font-black uppercase italic tracking-widest text-gray-900 dark:text-white border-2 rounded-xl  border-gray-100 dark:border-white/10 outline-none transition-all placeholder:text-gray-600 focus:border-[#21D0B8]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 pr-4 text-gray-500 hover:text-[#21D0B8] transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                    {isSearching && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#21D0B8]/30 border-t-[#21D0B8] animate-spin" />
                    )}
                    <div className="search-line absolute bottom-0 left-0 h-0.5 w-0 bg-[#21D0B8] transition-all duration-500" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {/* Показываем Входящие заявки, если не в режиме поиска */}
                    {!isSearchMode && incoming.map((user) => (
                        <motion.div
                            layout
                            key={`incoming-${user.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="custom-glass rounded-lg p-8 border-2 border-[#21D0B8]/50 shadow-[0_0_15px_rgba(33,208,184,0.15)] transition-all duration-300 relative group bg-[#21D0B8]/5"
                        >
                            <div className="absolute top-4 left-0 w-full text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#21D0B8]">Новая заявка</span>
                            </div>

                            <div className="flex flex-col items-center mt-6">
                                <div className="w-24 h-24 rounded-full border-2 border-[#21D0B8]/30 p-1.5 mb-6">
                                    <img src={getAvatar(user)} alt={user.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6">
                                    {user.name}
                                </h3>

                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => acceptRequest(user.id)}
                                        disabled={loadingIds.includes(user.id)}
                                        className="flex-1 h-10 bg-[#21D0B8] hover:bg-[#1db39e] text-white rounded-xl shadow-lg font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                        Принять
                                    </button>
                                    <button
                                        onClick={() => declineRequest(user.id)}
                                        disabled={loadingIds.includes(user.id)}
                                        className="flex-1 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                        Скрыть
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Показываем Исходящие заявки, если не в режиме поиска */}
                    {!isSearchMode && outgoing.map((user) => (
                        <motion.div
                            layout
                            key={`outgoing-${user.id}`}
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
                                    <img src={getAvatar(user)} alt={user.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-500 mb-6">
                                    {user.name}
                                </h3>

                                <button
                                    onClick={() => cancelOutgoing(user.id)}
                                    disabled={loadingIds.includes(user.id)}
                                    className="w-full h-10 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                    Отменить заявку
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Показываем основную сетку (Друзья или Результаты поиска) */}
                    {isLoading && !isSearchMode ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-12 h-12 rounded-full border-4 border-[#21D0B8]/30 border-t-[#21D0B8] animate-spin mx-auto" />
                        </div>
                    ) : gridItems.length > 0 ? (
                        gridItems.map((user) => {
                            const isSearchItem = 'friendship_status' in user;

                            let actionButton = null;

                            if (isSearchItem) {
                                const searchUser = user as SearchUser;
                                const isFriend = friends.some(f => f.id === user.id);
                                const isPendingOutgoing = outgoing.some(f => f.id === user.id) || (searchUser.friendship_status === 'pending' && searchUser.is_sender);
                                const isPendingIncoming = incoming.some(f => f.id === user.id);

                                if (isFriend) {
                                    actionButton = (
                                        <button className="w-full h-12 bg-white/5 text-emerald-400 rounded-2xl font-bold text-xs italic tracking-widest cursor-default">
                                            УЖЕ В ДРУЗЬЯХ
                                        </button>
                                    );
                                } else if (isPendingIncoming) {
                                    actionButton = (
                                        <button onClick={() => acceptRequest(user.id)} className="w-full h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/30 transition-all">
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
                                            onClick={() => sendRequest(user.id)}
                                            disabled={loadingIds.includes(user.id)}
                                            className="w-full h-12 bg-transparent border-2 border-[#21D0B8] text-[#21D0B8] hover:bg-[#21D0B8] hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                                            ДОБАВИТЬ
                                        </button>
                                    );
                                }
                            } else {
                                actionButton = null;
                            }

                            return (
                                <motion.div
                                    layout
                                    key={user.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -8 }}
                                    className="custom-glass rounded-lg p-8 border border-white/5 transition-all duration-300 relative group"
                                >
                                    <div className="absolute top-8 left-8">
                                        <span className="text-[9px] font-black text-gray-500 dark:text-white/20">ID: {user.id}</span>
                                    </div>

                                    <div className="absolute top-8 right-8 flex items-center">
                                        <span className={`status-dot ${user.is_online ? 'bg-[#21D0B8]' : 'bg-gray-400'}`} />
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                                            {user.is_online ? 'В сети' : (user.custom_status || 'Оффлайн')}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full border border-gray-100 dark:border-white/5 p-1.5 mb-6">
                                            <img src={getAvatar(user)} alt={user.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                        </div>

                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-2">
                                            {user.name}
                                        </h3>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <FaChartLine size={10} />
                                                <span className="text-[10px] font-bold">УР 1</span>
                                            </div>
                                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <FaUsers size={10} />
                                                <span className="text-[10px] font-bold">Активен</span>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3 mb-10 h-10">
                                            {user.watching ? (
                                                <>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Смотрит</p>
                                                        <p className="text-[10px] font-black text-[#21D0B8]">{user.progress || 0}%</p>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 italic truncate">
                                                        {user.watching}
                                                    </p>
                                                    <div className="progress-bar">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${user.progress || 0}%` }}
                                                            className="h-full bg-[#21D0B8]"
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
                                {isSearchMode ? 'По вашему запросу ' : 'У вас пока нет '} <span className="text-[#21D0B8]">{isSearchMode ? 'ничего не найдено' : 'друзей'}</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-[#21D0B8]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-[#00F2FE]/5 blur-[100px] rounded-full pointer-events-none" />

            <AddFriendModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
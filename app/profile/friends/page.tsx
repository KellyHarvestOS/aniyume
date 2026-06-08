'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaUsers, FaSearch, FaTimes } from 'react-icons/fa';
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
    selected_profile_frame?: string | null;
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

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    // Добавление нового друга по точному нику (через модалку)
    const sendRequestByNickname = async (nickname: string) => {
        const res = await api.post('/friends/by-nickname', { nickname });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Не удалось отправить запрос');

        await loadData();
    };

    const acceptRequest = async (userId: number) => {
        setLoading(userId, true);
        try {
            const res = await api.post(`/friends/${userId}/accept`, {});
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Не удалось принять заявку');
            }
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
            const res = await api.post(`/friends/${userId}/decline`, {});
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Не удалось удалить');
            }
            setIncoming(prev => prev.filter(u => u.id !== userId));
            setFriends(prev => prev.filter(u => u.id !== userId));
        } finally {
            setLoading(userId, false);
        }
    };

    const cancelOutgoing = async (userId: number) => {
        setLoading(userId, true);
        try {
            const res = await api.post(`/friends/${userId}/decline`, {});
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Не удалось отменить заявку');
            }
            setOutgoing(prev => prev.filter(u => u.id !== userId));
        } finally {
            setLoading(userId, false);
        }
    };

    const openProfile = (userId: number) => {
        router.push(`/users/${userId}`);
    };

    const getAvatar = (u: FriendUser) => {
        if (u.avatar) {
            return getStorageAssetUrl(u.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
        }
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
    };

    const isSearchMode = searchQuery.trim().length > 0;
    const query = searchQuery.trim().toLowerCase();
    const filteredFriends = isSearchMode
        ? friends.filter(f => f.name.toLowerCase().includes(query) || String(f.id) === query)
        : friends;

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
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900 dark:text-white leading-none">
                            Мои <span className="text-brand">Друзья</span>
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
                            <FaPlus size={10} /> Добавить друга
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
                        placeholder="Поиск по имени"
                        className="w-full bg-transparent pt-4 pb-3 pl-12 pr-10 text-sm font-black italic tracking-widest text-gray-900 dark:text-white border-2 rounded-xl border-gray-100 dark:border-white/10 outline-none transition-all placeholder:text-gray-500 focus:border-brand"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
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
                                <button type="button" onClick={() => openProfile(u.id)} className="w-24 h-24 rounded-full border-2 border-brand/30 p-1.5 mb-6">
                                    <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </button>
                                <button type="button" onClick={() => openProfile(u.id)} className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6">
                                    {u.name}
                                </button>

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
                                <button type="button" onClick={() => openProfile(u.id)} className="w-24 h-24 rounded-full border border-gray-400/30 p-1.5 mb-6 grayscale">
                                    <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                </button>
                                <button type="button" onClick={() => openProfile(u.id)} className="text-2xl font-black uppercase italic tracking-tighter text-gray-500 mb-6">
                                    {u.name}
                                </button>

                                <button
                                    onClick={() => cancelOutgoing(u.id)}
                                    disabled={loadingIds.includes(u.id)}
                                    className="w-full h-10 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50">
                                    Отменить заявку
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Основная сетка: друзья (с учётом локального поиска) */}
                    {isLoading && !isSearchMode ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-12 h-12 rounded-full border-4 border-brand/30 border-t-brand animate-spin mx-auto" />
                        </div>
                    ) : filteredFriends.length > 0 ? (
                        filteredFriends.map((u) => (
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
                                    <button type="button" onClick={() => openProfile(u.id)} className="w-24 h-24 rounded-full border border-gray-100 dark:border-white/5 p-1.5 mb-6 mt-4">
                                        <img src={getAvatar(u)} alt={u.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                    </button>

                                    <button type="button" onClick={() => openProfile(u.id)} className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-8 group-hover:text-brand transition-colors">
                                        {u.name}
                                    </button>

                                    <button
                                        onClick={() => router.push('/watch')}
                                        className="w-full h-[54px] bg-brand text-white dark:text-black rounded-2xl relative overflow-hidden transition-all active:scale-95 shadow-lg shadow-brand/10 hover:brightness-110 flex items-center justify-center gap-3"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] italic">
                                            <FaPlay size={8} className="fill-current" /> Пригласить
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center"
                        >
                            <p className="text-2xl font-black text-gray-400 tracking-tighter">
                                {isSearchMode ? 'Среди друзей ' : 'У вас пока нет '} <span className="text-brand">{isSearchMode ? 'ничего не найдено' : 'друзей'}</span>
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
                onSendByNickname={sendRequestByNickname}
            />

            <FriendRequestsModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                incoming={incoming}
                outgoing={outgoing}
                loadingIds={loadingIds}
                getAvatar={getAvatar}
                onAccept={acceptRequest}
                onDecline={declineRequest}
                onCancel={cancelOutgoing}
            />
        </div>
    );
}

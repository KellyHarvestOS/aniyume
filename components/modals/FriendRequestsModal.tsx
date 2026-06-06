'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCheck, FaUserTimes, FaClock, FaTimes, FaUsers, FaFingerprint, FaCrown } from 'react-icons/fa';

interface FriendRequest {
    id: number;
    name: string;
    avatar: string;
    time: string;
    level: number;
    isPremium: boolean;
    bio: string;
    mutualFriends: number;
}

export default function FriendRequestsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [requests, setRequests] = useState<FriendRequest[]>([
        { id: 101, name: "Naruto_Uzumaki", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naruto", time: "2 мин. назад", level: 42, isPremium: true, bio: "Стану Хокаге, даттебайо!", mutualFriends: 12 },
        { id: 102, name: "Sakura_Haruno", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura", time: "1 час назад", level: 28, isPremium: false, bio: "Медик-ниндзя в поиске команды", mutualFriends: 5 },
        { id: 103, name: "Sasuke_Uchiha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasuke", time: "Вчера", level: 50, isPremium: true, bio: "Ищу силу для восстановления клана", mutualFriends: 2 },
        { id: 104, name: "Hinata_Hyuga", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hinata", time: "3 дня назад", level: 15, isPremium: false, bio: "Никогда не сдаваться — это мой путь", mutualFriends: 8 },
    ]);

    const handleAction = (id: number) => {
        setRequests((prev) => prev.filter((req) => req.id !== id));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-3xl h-[650px] bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">Запросы</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                                    {requests.length} входящих заявок
                                </p>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                            {requests.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {requests.map((req) => (
                                        <motion.div
                                            layout
                                            key={req.id}
                                            className="relative p-4 rounded-xl bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/5 hover:border-brand-simple transition-all flex flex-col group shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-4 gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50 px-1.5 py-1 text-[9px] font-black uppercase text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                        <span className="rounded-lg bg-white px-1.5 py-0.5 text-[10px] text-slate-900 dark:bg-black/30 dark:text-white">{req.level}</span>
                                                        уровень
                                                    </span>
                                                    {req.isPremium && (
                                                        <span className="inline-flex items-center gap-1 rounded-xl bg-brand/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-brand">
                                                            <FaCrown size={9} /> Premium
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase">
                                                    <FaClock size={8} /> {req.time}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative shrink-0">
                                                    <div className="w-16 h-16 rounded-full border-2 border-brand-simple p-0.5 bg-white dark:bg-black/20">
                                                        <img src={req.avatar} alt="" className="w-full h-full rounded-full bg-gray-100 dark:bg-black" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-base text-gray-900 dark:text-white uppercase italic tracking-tight truncate">
                                                        {req.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase mt-1">
                                                        <FaFingerprint size={8} className="icon-brand" /> ID: {req.id}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/5 dark:bg-[#111111]">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed line-clamp-2 mb-3">
                                                    "{req.bio}"
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                                    <FaUsers size={10} className="icon-brand" /> {req.mutualFriends} общих друзей
                                                </div>
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleAction(req.id)}
                                                    className="flex-[2] h-10 rounded-xl bg-brand text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand/20"
                                                >
                                                    <FaUserCheck size={12} /> Принять
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id)}
                                                    className="flex-1 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase flex items-center justify-center hover:bg-red-500 hover:text-white active:scale-95 transition-all"
                                                >
                                                    <FaUserTimes size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20">
                                    <FaUsers size={100} className="text-gray-400 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Пусто</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-white/5 text-center shrink-0">
                         
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

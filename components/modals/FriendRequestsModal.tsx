'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCheck, FaUserTimes, FaClock, FaTimes, FaUsers, FaFingerprint } from 'react-icons/fa';

interface FriendRequestUser {
    id: number;
    name: string;
    avatar: string | null;
    custom_status: string | null;
    is_online: boolean;
}

interface FriendRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
    incoming: FriendRequestUser[];
    outgoing: FriendRequestUser[];
    loadingIds: number[];
    getAvatar: (user: FriendRequestUser) => string;
    onAccept: (id: number) => void;
    onDecline: (id: number) => void;
    onCancel: (id: number) => void;
}

export default function FriendRequestsModal({
    isOpen,
    onClose,
    incoming,
    outgoing,
    loadingIds,
    getAvatar,
    onAccept,
    onDecline,
    onCancel,
}: FriendRequestsModalProps) {
    const total = incoming.length + outgoing.length;

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
                        className="relative w-full max-w-2xl h-[650px] bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">Запросы</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                                    {incoming.length} входящих · {outgoing.length} исходящих
                                </p>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                            {total > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {incoming.map((req) => (
                                        <motion.div
                                            layout
                                            key={`incoming-${req.id}`}
                                            className="relative p-5 rounded-[2rem] bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/5 hover:border-brand-simple transition-all flex flex-col group shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[9px] font-black text-brand uppercase tracking-[0.2em]">Входящий</span>
                                                <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase">
                                                    <FaClock size={8} /> ожидает
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative shrink-0">
                                                    <div className="w-16 h-16 rounded-full border-2 border-brand-simple p-0.5">
                                                        <img src={getAvatar(req)} alt="" className="w-full h-full rounded-full bg-gray-100 dark:bg-black object-cover" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase italic tracking-tight truncate">
                                                        {req.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase">
                                                        <FaFingerprint size={8} className="icon-brand" /> ID: {req.id}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mb-6 flex-1 text-[11px] text-gray-600 dark:text-gray-400 italic leading-relaxed line-clamp-2 px-1">
                                                {req.custom_status || (req.is_online ? 'В сети' : 'Не в сети')}
                                            </p>

                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => onAccept(req.id)}
                                                    disabled={loadingIds.includes(req.id)}
                                                    className="flex-[2] h-10 rounded-lg bg-brand text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
                                                >
                                                    <FaUserCheck size={12} /> Принять
                                                </button>
                                                <button
                                                    onClick={() => onDecline(req.id)}
                                                    disabled={loadingIds.includes(req.id)}
                                                    className="flex-1 h-10 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    <FaUserTimes size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {outgoing.map((req) => (
                                        <motion.div
                                            layout
                                            key={`outgoing-${req.id}`}
                                            className="relative p-5 rounded-[2rem] bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/5 hover:border-brand-simple transition-all flex flex-col group shadow-sm opacity-75"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Исходящий</span>
                                                <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase">
                                                    <FaClock size={8} /> отправлен
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative shrink-0">
                                                    <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-white/10 p-0.5">
                                                        <img src={getAvatar(req)} alt="" className="w-full h-full rounded-full bg-gray-100 dark:bg-black object-cover" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase italic tracking-tight truncate">
                                                        {req.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase">
                                                        <FaFingerprint size={8} className="icon-brand" /> ID: {req.id}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mb-6 flex-1 text-[11px] text-gray-600 dark:text-gray-400 italic leading-relaxed line-clamp-2 px-1">
                                                {req.custom_status || 'Ожидание ответа'}
                                            </p>

                                            <button
                                                onClick={() => onCancel(req.id)}
                                                disabled={loadingIds.includes(req.id)}
                                                className="h-10 rounded-lg bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 text-[10px] font-black uppercase flex items-center justify-center hover:border-brand-simple active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                Отменить
                                            </button>
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

                        <div className="p-6 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-white/5 text-center shrink-0" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

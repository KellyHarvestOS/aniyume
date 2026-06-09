
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaEllipsisV, FaBan, FaTrashAlt, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageAssetUrl } from '@/lib/storage';
interface ChatHeaderProps {
    friendId: number;
    friendName: string;
    friendAvatar?: string | null;
    isOnline: boolean;
    isBlocked?: boolean;
    onClear?: () => void | Promise<void>;
    onBlock?: () => void | Promise<void>;
}
export default function ChatHeader({ friendId, friendName, friendAvatar, isOnline, isBlocked = false, onClear, onBlock }: ChatHeaderProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInvite = () => {
        setIsMenuOpen(false);
        router.push('/watch');
    };

    const handleClearChat = async () => {
        setIsMenuOpen(false);
        if (window.confirm('Очистить всю переписку?')) await onClear?.();
    };

    const handleBlockUser = async () => {
        setIsMenuOpen(false);
        await onBlock?.();
    };

    return (
        <div className="sticky top-0 z-[100] custom-glass border-b border-gray-100 dark:border-white/5 shrink-0 px-3 md:px-8 bg-white/90 dark:bg-black/90 backdrop-blur-xl">
            <div className="h-16 md:h-20 flex items-center justify-between">

                <div className="flex items-center gap-3 md:gap-6">
                    <button
                        onClick={() => router.push('/profile/friends')}
                        className="w-9 h-9 md:w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand transition-all duration-300 group border border-transparent hover:border-brand/30 hover:scale-105 active:scale-95"
                    >
                        <FaArrowLeft size={14} className="md:text-base group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button type="button" onClick={() => router.push(`/users/${friendId}`)} className="flex items-center gap-3 md:gap-4 group cursor-pointer text-left">
                        <div className="relative shrink-0">
                            <img
                                src={getStorageAssetUrl(friendAvatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendId}`}
                                alt="Avatar"
                                className="relative w-10 h-10 md:w-12 h-12 rounded-full border-2 border-white dark:border-[#151515] object-cover bg-gray-800 z-10 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white dark:border-[#111111] rounded-full z-20 ${isOnline ? 'bg-brand' : 'bg-gray-500'}`} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base md:text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none group-hover:text-brand transition-colors truncate">
                                {friendName}
                            </h2>
                            <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1 md:mt-1.5 flex items-center gap-1.5 ${isOnline ? 'text-brand' : 'text-gray-400'}`}>
                                {isOnline ? 'В сети' : 'Оффлайн'}
                            </p>
                        </div>
                    </button>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`w-9 h-9 md:w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border border-transparent
                        ${isMenuOpen
                                ? 'bg-brand/10 text-brand border-brand/30'
                                : 'bg-white dark:bg-white/5 text-gray-500 hover:text-brand hover:border-brand/30'
                            } hover:scale-105 active:scale-95`}
                    >
                        <FaEllipsisV size={14} className={`md:text-base transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
                    </button>


                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-12 md:top-14 w-56 md:w-64 z-[120] bg-white dark:bg-[#151515]/95 rounded-xl p-1.5 md:p-2 border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl"
                            >
                                <button
                                    onClick={handleInvite}
                                    className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-brand hover:bg-brand/10 transition-all group"
                                >
                                    <FaPlay size={10} className="group-hover:scale-110 transition-transform" />
                                    Пригласить на просмотр
                                </button>

                                <div className="h-px w-full bg-gray-200 dark:bg-white/5 my-1" />

                                <button
                                    onClick={handleClearChat}
                                    className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-orange-500 hover:bg-orange-500/10 transition-all group"
                                >
                                    <FaTrashAlt size={12} className="group-hover:scale-110 transition-transform" />
                                    Очистить чат
                                </button>

                                <button
                                    onClick={handleBlockUser}
                                    className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-red-600 dark:text-red-500 hover:bg-red-500/10 transition-all group"
                                >
                                    <FaBan size={12} className="group-hover:scale-110 transition-transform" />
                                    {isBlocked ? 'Разблокировать' : 'Заблокировать'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

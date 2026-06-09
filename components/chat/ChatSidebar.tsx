
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getStorageAssetUrl } from '@/lib/storage';
export interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    gifUrl?: string;
    senderId: number;
    timestamp: Date;
}
export interface ChatPreview {
    id: number;
    name: string;
    avatar?: string | null;
    is_online: boolean;
    lastMessage?: string;
    unreadCount?: number;
}
interface ChatSidebarProps {
    chats: ChatPreview[];
    activeChatId: number;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
}
export default function ChatSidebar({ chats, activeChatId, searchQuery, setSearchQuery }: ChatSidebarProps) {
    const router = useRouter();
    const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={`
        ${activeChatId ? 'hidden lg:flex' : 'flex'} 
        w-full lg:w-[340px] flex-col relative z-10 custom-glass border-r border-b lg:!border-2 border-gray-100 dark:border-white/5 shrink-0 bg-white/30 dark:bg-black/20 h-full
    `}>
            <div className="h-16 lg:h-14 shrink-0 px-4 lg:px-4 border-b border-gray-100 dark:border-white/5 flex flex-col justify-center gap-1.5 lg:gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs lg:text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Чаты</h3>
                    <span className="text-[9px] lg:text-[10px] font-bold text-gray-400">{chats.length} всего</span>
                </div>

                <div className="relative group">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors text-[10px] lg:text-xs" />
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-white/5 rounded-lg py-1.5 lg:py-1.5 pl-8 pr-3 text-[11px] lg:text-xs font-medium text-gray-900 dark:text-white outline-none border border-transparent focus:border-brand/50 transition-all placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                <AnimatePresence>
                    {filteredChats.map((chat) => {
                        const isActive = chat.id === activeChatId;
                        return (
                            <motion.button
                                layout
                                key={chat.id}
                                onClick={() => router.push(`/profile/friends/chat/${chat.id}`)}
                                className={`w-full px-4 py-3 lg:py-2 flex items-center gap-3 lg:gap-4 transition-all group relative overflow-hidden
                                ${isActive ? 'bg-brand/10 dark:bg-brand/10 border-l-4 border-brand' : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'}
                            `}
                            >
                                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent pointer-events-none" />}

                                <div className="relative shrink-0">
                                    <img
                                        src={getStorageAssetUrl(chat.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.id}`}
                                        alt={chat.name}
                                        className="w-11 h-11 lg:w-10 lg:h-10 rounded-full border border-gray-200 dark:border-white/10 object-cover bg-gray-800 transition-transform group-active:scale-95"
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3 lg:w-3.5 h-3 lg:h-3.5 border-2 border-white dark:border-[#111111] rounded-full ${chat.is_online ? 'bg-brand' : 'bg-gray-400'}`} />
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-center mb-0.5 lg:mb-1">
                                        <h4 className={`text-sm lg:text-sm font-black uppercase tracking-tighter truncate ${isActive ? 'text-brand' : 'text-gray-900 dark:text-white'}`}>
                                            {chat.name}
                                        </h4>
                                    </div>
                                    <p className="text-[11px] lg:text-xs text-gray-500 truncate pr-4 font-medium relative">
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                {chat.unreadCount && chat.unreadCount > 0 && (
                                    <span className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 bg-brand text-white dark:text-black text-[8px] lg:text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-brand/20">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
                {filteredChats.length === 0 && (
                    <div className="p-6 text-center text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Ничего не найдено
                    </div>
                )}
            </div>
        </div>
    );
}
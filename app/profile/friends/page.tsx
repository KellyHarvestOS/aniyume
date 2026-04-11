'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaUsers, FaChartLine, FaSearch, FaTimes } from 'react-icons/fa';
import AddFriendModal from '@/components/modals/AddFriendModal';
import { useRouter } from 'next/navigation';
import FriendRequestsModal from '@/components/modals/FriendRequestsModal';

const FRIENDS = [
    { id: 1, name: "ALEX_KUN", status: "В сети", watching: "Поднятие уровня в одиночку", progress: 85, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: 2, name: "MikuChan", status: "В сети", watching: "Провожающая в последний путь Фрирен", progress: 100, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miku" },
    { id: 3, name: "Satoru_Gojo", status: "Оффлайн", watching: "Магическая битва", progress: 40, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gojo" },
    { id: 4, name: "Senpai_99", status: "В сети", watching: "Наруто", progress: 15, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Senpai" },
    { id: 5, name: "ZeroTwo", status: "В сети", watching: "Милый во Франксе", progress: 70, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZeroTwo" },
    { id: 6, name: "Itachi_Uchiha", status: "Оффлайн", watching: "Наруто: Ураганные хроники", progress: 100, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Itachi" },
    { id: 7, name: "Levi_Ackerman", status: "В сети", watching: "Атака титанов", progress: 55, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Levi" },
    { id: 8, name: "Rem_Chan", status: "В сети", watching: "Re:Zero", progress: 90, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rem" },
    { id: 9, name: "KakashiHatake", status: "Оффлайн", watching: "Наруто", progress: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kakashi" },
    { id: 10, name: "Tanjiro_Kamado", status: "В сети", watching: "Клинок, рассекающий демонов", progress: 35, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanjiro" },
    { id: 11, name: "Megumin", status: "В сети", watching: "Этот замечательный мир!", progress: 80, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Megumin" },
    { id: 12, name: "Killua_Zoldyck", status: "Оффлайн", watching: "Hunter x Hunter", progress: 50, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Killua" },
];

export default function FriendsPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const filteredFriends = FRIENDS.filter(friend => {
        const query = searchQuery.toLowerCase();
        return (
            friend.name.toLowerCase().includes(query) ||
            friend.id.toString() === query
        );
    });

    return (
        <div className="min-h-screen bg-white dark:bg-[#111111] transition-colors pb-12 overflow-hidden relative">

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
                            Мои <span className="text-brand w-[14rem]">Друзья</span>
                        </h1>
                        <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] ml-1">
                            Общайся • Смотри • Делись
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsRequestModalOpen(true)}
                            className="relative w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand border border-transparent hover:border-brand-simple transition-all group shadow-inner"
                        >
                            <FaUsers size={20} className="group-hover:icon-brand transition-colors" />

                            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-[#111111] shadow-lg animate-bounce">
                                3
                            </span>
                        </button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brand text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter text-xs hover:scale-105 transition-all active:scale-95 shadow-lg shadow-brand/20"
                        >
                            Добавить
                        </button>
                    </div>
                </div>

                <div className="mt-5 relative max-w-md group rounded-xl">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-5">
                        <FaSearch size={14} className="icon-brand" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ПОИСК ПО ИМЕНИ ИЛИ ID..."
                        className="w-full bg-gray-50 dark:bg-white/5 pt-4 pb-3 pl-12 pr-10 text-sm font-black uppercase italic tracking-widest text-gray-900 dark:text-white border-2 rounded-xl border-gray-100 dark:border-white/10 outline-none transition-all placeholder:text-gray-500 focus:border-brand"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => (
                            <motion.div
                                layout
                                key={friend.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8 }}
                                className="relative group p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:border-brand-simple transition-all duration-300 shadow-xl dark:bg-black/20 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-6 left-6">
                                    <span className="text-[9px] font-black text-gray-400 dark:text-white/20 uppercase tracking-tighter">ID: {friend.id}</span>
                                </div>

                                <div className="absolute top-6 right-6 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${friend.status === 'В сети' ? 'bg-green-500 shadow-green-500/50' : 'bg-gray-400 shadow-transparent'}`} />
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{friend.status}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full border-2 border-brand-simple p-1 mb-6 group-hover:scale-105 transition-transform duration-500">
                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-2 group-hover:text-brand transition-colors">
                                        {friend.name}
                                    </h3>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <FaChartLine size={10} className="icon-brand" />
                                            <span className="text-[10px] font-bold">УР 42</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 dark:bg-white/10 rounded-full" />
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <FaUsers size={10} className="icon-brand" />
                                            <span className="text-[10px] font-bold">156</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 mb-10">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Смотрит</p>
                                            <p className="text-[10px] font-black text-brand">{friend.progress}%</p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 italic truncate w-full text-center">
                                            {friend.watching}
                                        </p>
                                        {/* Progress Bar */}
                                        <div className="h-1 w-full bg-brand/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${friend.progress}%` }}
                                                className="h-full bg-brand"
                                            />
                                        </div>
                                    </div>

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
                            <p className="text-2xl font-black uppercase italic text-gray-400 tracking-tighter">
                                Друг с таким <span className="text-brand">именем или ID</span> не найден
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
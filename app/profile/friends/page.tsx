'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaUsers, FaChartLine, FaSearch, FaTimes } from 'react-icons/fa';
import AddFriendModal from '@/components/modals/AddFriendModal';
import { useRouter } from 'next/navigation';

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
    const filteredFriends = FRIENDS.filter(friend => {
        const query = searchQuery.toLowerCase();
        return (
            friend.name.toLowerCase().includes(query) ||
            friend.id.toString() === query
        );
    });



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

                /* Стиль для фокуса инпута */
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

            <div className="container mx-auto px-20 pt-5 mb-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-5">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
                            Мои <span className="text-[#21D0B8]">Друзья</span>
                        </h1>
                        <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] ml-1">
                            Общайся • Смотри • Делись
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-[#080808] bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-4 border-white dark:border-[#080808] bg-[#21D0B8] flex items-center justify-center text-[10px] font-black text-white">
                                +{FRIENDS.length}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#21D0B8] text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter text-xs hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-[#21D0B8]/20">
                            Добавить
                        </button>
                    </div>
                </div>

                <div className="mt-5 relative max-w-md group   rounded-xl">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-5 text-[#21D0B8]">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ПОИСК ПО ИМЕНИ ИЛИ ID..."
                        className=" w-full bg-transparent pt-4 pb-3 pl-12 pr-10 text-sm font-black uppercase italic tracking-widest text-gray-900 dark:text-white border-2 rounded-xl  border-gray-100 dark:border-white/10 outline-none transition-all placeholder:text-gray-600 focus:border-[#21D0B8]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#21D0B8] transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                    <div className="search-line absolute bottom-0 left-0 h-0.5 w-0 bg-[#21D0B8] transition-all duration-500" />
                </div>
            </div>

            <div className="container mx-auto px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                                className="custom-glass rounded-lg p-8 border border-teal-500 transition-all duration-300 relative group"
                            >
                                <div className="absolute top-8 left-8">
                                    <span className="text-[9px] font-black text-gray-500 dark:text-white/20">ID: {friend.id}</span>
                                </div>

                                <div className="absolute top-8 right-8 flex items-center">
                                    <span className={`status-dot ${friend.status === 'В сети' ? 'bg-[#21D0B8]' : 'bg-gray-400'}`} />
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{friend.status}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full border border-gray-100 dark:border-white/5 p-1.5 mb-6">
                                        <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover bg-gray-50 dark:bg-white/5" />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-2">
                                        {friend.name}
                                    </h3>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <FaChartLine size={10} />
                                            <span className="text-[10px] font-bold">УР 42</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <FaUsers size={10} />
                                            <span className="text-[10px] font-bold">156</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 mb-10">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Смотрит</p>
                                            <p className="text-[10px] font-black text-[#21D0B8]">{friend.progress}%</p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 italic truncate">
                                            {friend.watching}
                                        </p>
                                        <div className="progress-bar">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${friend.progress}%` }}
                                                className="h-full bg-[#21D0B8]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/watch')}
                                        className="btn-premium w-full h-[54px] bg-[#21D0B8] rounded-2xl relative overflow-hidden transition-all active:scale-95 shadow-xl shadow-[#21D0B8]/10"
                                    >
                                        <div className="lava-wrap"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white dark:text-[#080808]">
                                            <FaPlay size={8} /> Пригласить
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
                                Друг с таким <span className="text-[#21D0B8]">именем или ID</span> не найден
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
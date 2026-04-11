'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoPersonAddSharp } from 'react-icons/io5';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
    const [friendId, setFriendId] = useState('');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative z-10 w-full max-w-[440px] overflow-hidden
                                   bg-white dark:bg-[#111111] 
                                   rounded-2xl shadow-2xl 
                                   border border-gray-200 dark:border-gray-800"
                    >
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                        ДОБАВИТЬ <span className="text-brand">ДРУГА</span>
                                    </h2>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">
                                        Поиск по уникальному ID
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-white/5 
                                               text-gray-500 hover:text-brand 
                                               transition-all duration-300 hover:rotate-90"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            <div className="mb-8">
                                <div className="group relative flex items-center bg-gray-50 dark:bg-[#0d0d0d] 
                                                border border-gray-200 dark:border-gray-800 
                                                rounded-2xl px-5 py-4 transition-all duration-300
                                                focus-within:border-brand focus-within:ring-4 ring-brand/5">
                                    <IoPersonAddSharp
                                        className="text-gray-400 group-focus-within:text-brand transition-colors"
                                        size={22}
                                    />
                                    <input
                                        type="text"
                                        value={friendId}
                                        onChange={(e) => setFriendId(e.target.value)}
                                        placeholder="Например: #8842"
                                        className="bg-transparent w-full ml-4 outline-none text-base font-medium
                                                   text-gray-900 dark:text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <button className="relative w-full group overflow-hidden h-[60px] rounded-2xl 
                                               bg-brand text-white font-bold text-lg
                                               shadow-lg shadow-brand/20
                                               hover:shadow-brand/40 transition-all duration-300
                                               active:scale-[0.98]">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Отправить запрос
                                </span>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full 
                                                group-hover:translate-x-full transition-transform 
                                                duration-700 skew-x-25" />
                            </button>

                            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                                Убедитесь, что ID введен корректно, включая символы
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
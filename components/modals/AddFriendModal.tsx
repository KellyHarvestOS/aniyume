'use client';

import React, { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoPersonAddSharp } from 'react-icons/io5';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendByNickname: (nickname: string) => Promise<void>;
}

export default function AddFriendModal({ isOpen, onClose, onSendByNickname }: AddFriendModalProps) {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = nickname.trim();
        if (!value) return;

        setIsSending(true);
        setError('');
        try {
            await onSendByNickname(value);
            setNickname('');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось отправить запрос');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.form
                        onSubmit={handleSubmit}
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
                                        Поиск по уникальному имени пользователя, включая символы
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-white/5
                                               text-gray-500 hover:text-brand
                                               transition-all duration-300 hover:rotate-90"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            <div className="mb-4">
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
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Например: YumeFan"
                                        className="bg-transparent w-full ml-4 outline-none text-base font-medium
                                                   text-gray-900 dark:text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="mb-4 text-center text-xs font-bold text-red-500">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSending || !nickname.trim()}
                                className="relative w-full group overflow-hidden h-[60px] rounded-2xl
                                               bg-brand text-white font-bold text-lg
                                               shadow-lg shadow-brand/20
                                               hover:shadow-brand/40 transition-all duration-300
                                               active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSending ? 'Отправляем...' : 'Отправить запрос'}
                                </span>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full
                                                group-hover:translate-x-full transition-transform
                                                duration-700 skew-x-25" />
                            </button>

                            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                                Убедитесь, что имя введено корректно, включая символы
                            </p>
                        </div>
                    </motion.form>
                </div>
            )}
        </AnimatePresence>
    );
}

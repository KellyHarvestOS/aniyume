'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { IoClose, IoSend } from 'react-icons/io5';
import { PiSoundcloudLogoFill } from "react-icons/pi";

interface ChatModalProps {
    onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
    const controls = useAnimation();
    const [side, setSide] = useState<'left' | 'right'>('right');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        controls.start({
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        });
    }, [controls]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const windowWidth = window.innerWidth;
        const modalWidth = modalRef.current?.offsetWidth || 380;
        const margin = 24;

        if (info.point.x < windowWidth / 2) {
            setSide('left');
            const travelDistance = windowWidth - modalWidth - (margin * 2);
            controls.start({ x: -travelDistance, transition: { type: 'spring', stiffness: 250, damping: 25 } });
        } else {
            setSide('right');
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } });
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Доброе утро";
        } else if (hour >= 12 && hour < 18) {
            return "Добрый день";
        } else if (hour >= 18 && hour < 23) {
            return "Добрый вечер";
        } else {
            return "Доброй ночи";
        }
    };

    return (
        <motion.div
            ref={modalRef}
            drag="x"
            dragConstraints={{ left: -(window.innerWidth), right: 0 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ x: 100, opacity: 0, scale: 0.95 }}
            animate={controls}
            exit={{ x: 100, opacity: 0, scale: 0.95 }}
            style={{ touchAction: 'none' }}
            className={`fixed bottom-24 z-100 w-[320px] sm:w-[360px] h-[520px] flex flex-col overflow-hidden
                bg-white dark:bg-[#0f0f0f] 
                border border-white/20 dark:border-gray-800/50 
                shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]
                rounded-xl ring-1 ring-black/5 dark:ring-white/5
                right-6
            `}
        >
            <div className="relative bg-linear-to-r from-[#2EC4B6] to-[#28b1a4] p-4 flex items-center justify-between cursor-grab active:cursor-grabbing shadow-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-md border border-white/30 text-white shadow-inner">
                            <PiSoundcloudLogoFill className="text-2xl" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-[#2EC4B6] rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight leading-tight">AniYume Support</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">AI Assistant</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/90 hover:text-white"
                >
                    <IoClose size={22} />
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-[#f8fafc] dark:bg-[#0d0d0d] relative custom-scrollbar">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#2EC4B6_1px,transparent_1px)] bg-size-[16px_16px]"></div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                >
                    <div className="w-8 h-8 rounded-lg bg-[#2EC4B6] flex items-center justify-center text-white shrink-0 shadow-sm">
                        <PiSoundcloudLogoFill size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5 max-w-[80%]">
                        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl rounded-tl-none shadow-sm shadow-black/5">
                            <p className="text-[13px] text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                                {getGreeting()}! Я твой личный помощник по миру AniYume. Чем я могу скрасить твоё время?
                            </p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold px-1 uppercase tracking-tighter">Support • Just now</span>
                    </div>
                </motion.div>

                <div className="flex flex-wrap gap-2">
                    {['Расписание', 'Проблемы с плеером', 'Донат'].map((text) => (
                        <button key={text} className="text-[11px] font-bold py-1.5 px-3 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#2EC4B6] hover:bg-[#2EC4B6] hover:text-white transition-all duration-200">
                            {text}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0f0f0f] border-t border-slate-100 dark:border-white/5">
                <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-xl border border-transparent focus-within:border-[#2EC4B6]/50 transition-all duration-300 shadow-inner">
                    <input
                        type="text"
                        placeholder="Задайте вопрос..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-200 placeholder:text-slate-400 dark:placeholder:text-gray-600"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#2EC4B6] text-white p-2.5 rounded-lg shadow-lg shadow-[#2EC4B6]/30 hover:shadow-[#2EC4B6]/50 transition-all"
                    >
                        <IoSend size={16} />
                    </motion.button>
                </div>
                <p className="text-[9px] text-center mt-3 text-slate-400 uppercase tracking-widest font-bold opacity-50">
                    AniYume Portal System
                </p>
            </div>
        </motion.div>
    );
}
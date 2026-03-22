"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaShieldAlt, FaRocket, FaStar, FaMagic, FaArrowLeft } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import Link from "next/link";

export default function PremiumAuthPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };


    return (
        <div className="relative min-h-dvh lg:h-dvh w-full bg-white dark:bg-[#0a0a0a] lg:bg-[#168a7f] lg:dark:bg-[#168a7f] overflow-x-hidden lg:overflow-hidden font-sans flex flex-col lg:block">

            <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hover:text-slate-500 transition-colors font-bold text-sm">
                <FaArrowLeft /> На главную
            </Link>

            <div className="absolute inset-0 w-full h-full z-0 hidden lg:block overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[40%] w-[350px] h-[350px] bg-[#00F2FE] rounded-full mix-blend-screen filter blur-[90px] opacity-60 pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], x: [0, -40, 0], y: [0, -50, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[0%] w-[450px] h-[450px] bg-[#a7ffeb] rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[40%] left-[55%] w-[300px] h-[300px] bg-[#ffffff] rounded-full mix-blend-overlay filter blur-[100px] opacity-30 pointer-events-none"
                />
            </div>

            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden lg:block text-white dark:text-[#0a0a0a]">
                <svg className="w-full h-full block" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon
                        points="0,0 50,0 45,42 47,49 41,100 0,100"
                        fill="currentColor"
                    />
                    <polyline
                        points="50,0 45,42 47,49 41,100"
                        fill="none"
                        stroke=""
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            <div className="relative z-20 w-full h-full flex flex-col lg:flex-row">

                <div className="w-full lg:w-[45%] min-h-[50vh] lg:min-h-full flex flex-col items-center justify-center p-8 lg:p-12 bg-white dark:bg-[#0a0a0a] lg:bg-transparent lg:dark:bg-transparent">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md w-full space-y-10"
                    >
                        <div className="space-y-2">
                            <span className="inline-block py-1 px-3 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                                Текущий тариф
                            </span>
                            <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                                FREE<span className="text-slate-400">.</span>
                            </h2>
                            <p className="text-slate-500 font-medium">Базовые возможности для начала.</p>
                        </div>

                        <ul className="space-y-6">
                            {["Full HD 1080p", "Стандартный плеер", "Общий каталог", "Рекламные блоки"].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-bold text-base">
                                    <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
                                        <FaCheck className="text-sm" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                            {["Без GIF-аватарок", "Обычный никнейм"].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-400 dark:text-slate-600 font-medium text-base line-through">
                                    <div className="p-2 rounded-full bg-transparent text-slate-300 dark:text-slate-700">
                                        <FaTimes className="text-sm" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <div className="w-full lg:flex-1 min-h-[50vh] lg:min-h-full flex flex-col items-center justify-center p-8 lg:p-12 bg-[#168a7f] lg:bg-transparent relative overflow-hidden lg:overflow-visible">

                    <div className="absolute inset-0 block lg:hidden pointer-events-none z-0">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00F2FE] rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#a7ffeb] rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
                    </div>

                    <div className="relative z-10 max-w-md w-full text-white">
                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <motion.div
                                    animate={{ y: [0, -9, 0], rotate: [12, 12, 12] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <RiVipCrownFill className="text-white text-5xl drop-shadow-md" />
                                </motion.div>
                                <div>
                                    <h2 className="text-6xl font-black italic tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-[#a7ffeb]  w-[285px]!">
                                        PREMIUM
                                    </h2>
                                    <p className="text-white/80 font-bold tracking-widest text-xs uppercase mt-1">
                                        AniYume возможности
                                    </p>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-white/95 leading-relaxed drop-shadow-sm">
                                Разблокируй истинный потенциал своего профиля и смотри без границ.
                            </p>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {[
                                    { icon: <FaRocket />, t: "GIF Аватарки", d: "Живой профиль" },
                                    { icon: <FaShieldAlt />, t: "Особая роль", d: "Цвет ника" },
                                    { icon: <FaStar />, t: "Без рекламы", d: "Только контент" },
                                    { icon: <FaMagic />, t: "Свои Темы", d: "Стиль сайта" },
                                ].map((item, i) => (
                                    <motion.div key={i} variants={itemVariants} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all cursor-default shadow-lg">
                                        <div className="text-3xl text-[#a7ffeb] drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-black uppercase text-[11px] tracking-wider text-white">
                                                {item.t}
                                            </div>
                                            <div className="text-[10px] text-white/70 font-semibold mt-0.5">
                                                {item.d}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4 bg-white text-[#168a7f] py-5 rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl transition-all relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Получить за 199₽ <span className="text-xs opacity-60">/ мес</span>
                                </span>
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
}
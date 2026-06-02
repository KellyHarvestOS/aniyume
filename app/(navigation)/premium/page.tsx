'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaMagic, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiGif } from "react-icons/hi2";
import { RiVipCrownFill } from "react-icons/ri";
import { HiCursorClick } from "react-icons/hi";
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
        <div className="relative min-h-dvh lg:h-dvh w-full bg-white dark:bg-[#0a0a0a] lg:bg-[#010606] lg:dark:bg-[#010606] overflow-x-hidden lg:overflow-hidden font-sans flex flex-col lg:block">
            <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hover:text-slate-500 transition-colors font-bold text-sm">
                <FaArrowLeft /> На главную
            </Link>

            <div className="absolute inset-0 w-full h-full z-0 hidden lg:block overflow-hidden bg-[#010606]">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#00F2FE_0%,#168a7f_25%,#0F52BA_50%,#00F2FE_75%,#168a7f_100%)] bg-size-[400%_400%] animate-[gradient-xy_15s_ease_infinite] mix-blend-multiply opacity-[0.35]"></div>
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                <motion.div
                    animate={{ scale: [1, 1.25, 1], x: ['0%', '15%', '-10%', '0%'], y: ['0%', '10%', '-15%', '0%'], rotate: [0, 90, 180, 360] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-25%] right-[-15%] w-[65vw] h-[65vw] max-w-[1000px] max-h-[1000px] bg-[conic-gradient(from_0deg,#168a7f,#00F2FE,#020808,#168a7f)] rounded-[40%_60%_70%_30%] filter blur-[120px] opacity-60 pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.4, 1], x: ['0%', '-25%', '15%', '0%'], y: ['0%', '-20%', '25%', '0%'], rotate: [360, 180, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-25%] right-[5%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] bg-[conic-gradient(from_180deg,#a7ffeb,#00F2FE,#0F52BA,#a7ffeb)] rounded-[60%_40%_30%_70%] mix-blend-screen filter blur-[130px] opacity-40 pointer-events-none"
                />
                <div className="absolute top-[15%] right-[25%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-[conic-gradient(from_90deg,#00F2FE,#168a7f,transparent,#00F2FE)] rounded-[50%_50%_40%_60%] mix-blend-color-dodge filter blur-[110px] opacity-50 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px][mask-image:radial-gradient(ellipse_75%_75%_at_75%_50%,#000_15%,transparent_100%)] pointer-events-none" />
            </div>

            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden lg:block text-white dark:text-[#0a0a0a]">
                <svg className="w-full h-full block drop-shadow-[20px_0_50px_rgba(0,0,0,0.7)] dark:drop-shadow-[20px_0_60px_rgba(0,0,0,0.95)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <filter id="blur-glow">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="glow-line" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00F2FE" />
                            <stop offset="33%" stopColor="#a7ffeb" />
                            <stop offset="66%" stopColor="#168a7f" />
                            <stop offset="100%" stopColor="#0F52BA" />
                        </linearGradient>
                        <pattern id="dot-grid" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                            <circle cx="1.5" cy="1.5" r="0.15" fill="currentColor" fillOpacity="0.04" />
                        </pattern>
                    </defs>
                    <polygon points="0,0 50,0 45,42 47,49 41,100 0,100" fill="currentColor" />
                    <polygon points="0,0 50,0 45,42 47,49 41,100 0,100" fill="url(#dot-grid)" className="text-slate-900 dark:text-white" />
                    <polyline points="50,0 45,42 47,49 41,100" fill="none" stroke="url(#glow-line)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" filter="url(#blur-glow)" className="opacity-100" />
                    <polyline points="50,0 45,42 47,49 41,100" fill="none" stroke="#ffffff" strokeWidth="0.15" vectorEffect="non-scaling-stroke" className="opacity-90 mix-blend-overlay" />
                </svg>
            </div>

            <div className="relative z-20 w-full h-full flex flex-col lg:flex-row">
                <div className="w-full lg:w-[45%] min-h-[50vh] lg:min-h-full flex flex-col items-center justify-center p-8 lg:p-12 bg-white dark:bg-[#0a0a0a] lg:bg-transparent lg:dark:bg-transparent">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full space-y-10">
                        <div className="space-y-2">
                            <span className="inline-block py-1 px-3 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Текущий тариф</span>
                            <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">FREE<span className="text-slate-400">.</span></h2>
                            <p className="text-slate-500 font-medium">Базовые возможности для начала.</p>
                        </div>
                        <ul className="space-y-6">
                            {["Full HD 1080p", "Стандартный плеер", "Общий каталог", "Стандартный стиль сайта", "Обычный никнейм"].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-bold text-base">
                                    <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500"><FaCheck className="text-sm" /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <div className="w-full lg:flex-1 min-h-[50vh] lg:min-h-full flex flex-col items-center justify-center p-8 lg:p-12 bg-[#010606] lg:bg-transparent relative overflow-hidden lg:overflow-visible">
                    <div className="relative z-10 max-w-md w-full text-white">
                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                                    <RiVipCrownFill className="text-white text-5xl drop-shadow-md" />
                                </motion.div>
                                <div>
                                    <h2 className="text-6xl font-black italic tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-[#a7ffeb] w-[285px]!">
                                        PREMIUM
                                    </h2>
                                    <p className="text-white/80 font-bold tracking-widest text-xs uppercase mt-1">AniYume возможности</p>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-white/95 leading-relaxed">Разблокируй истинный потенциал своего профиля и смотри без границ.</p>

                            <motion.ul variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                                {[
                                    { icon: <HiGif />, t: "GIF Аватарки", d: "Живой профиль" },
                                    { icon: <BsFillPeopleFill />, t: "Увеличенный совместный просмотр", d: "До 10 человек одновременно" },
                                    { icon: <FaMagic />, t: "Свои темы", d: "Персональный стиль сайта" },
                                    { icon: <HiCursorClick />, t: "Уникальные курсоры мыши", d: "Выделяйся в каждом клике" },
                                    { icon: <FaShieldAlt />, t: "Приоритетная поддержка", d: "Помощь в первую очередь" },
                                ].map((item, i) => (
                                    <motion.li key={i} variants={itemVariants} className="flex items-center gap-5 group">
                                        <div className="shrink-0 p-3 rounded-full bg-white/10 text-[#fdfefe] shadow-lg group-hover:bg-[#f1f1f1] group-hover:text-[#16758a] transition-all duration-300">
                                            <div className="text-xl">{item.icon}</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-white tracking-tight leading-none">{item.t}</span>
                                            <span className="text-sm font-medium text-white/60 mt-1">{item.d}</span>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <motion.div
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4"
                            >
                                <Link
                                    href="https://boosty.to/aniyume"
                                    className="block w-full bg-white text-[#168a7f] py-5 rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl transition-all relative overflow-hidden group text-center"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Получить за 199₽ <span className="text-xs opacity-60">/ мес</span>
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                @keyframes gradient-xy { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            `}} />
        </div>
    );
}

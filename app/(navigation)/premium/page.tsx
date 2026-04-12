'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaArrowLeft, FaShieldAlt, FaCrown, FaCreditCard, FaLock, FaRocket, FaMagic } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiGif } from "react-icons/hi2";
import { RiVipCrownFill } from "react-icons/ri";
import { HiCursorClick } from "react-icons/hi";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function PremiumAuthPage() {
    const { user, login, token } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Checkout, 3: Success

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Имитация задержки оплаты
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await api.post('/payment/premium', {});
            const data = await res.json();

            if (res.ok) {
                if (token && data.user) {
                    login(token, data.user);
                }
                setStep(3);
            } else {
                alert(data.message || 'Ошибка оплаты');
            }
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при обработке платежа');
        } finally {
            setIsProcessing(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // --- Рендеринг SUCCESS ---
    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-brand blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative bg-brand text-black w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl">
                            <FaCrown />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">ВЫ ТЕПЕРЬ PREMIUM!</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Спасибо за вашу поддержку. Теперь вам доступны все функции Aniyume без ограничений.
                    </p>
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-2xl shadow-white/10"
                    >
                        В личный кабинет
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-dvh lg:h-dvh w-full bg-white dark:bg-[#0a0a0a] lg:bg-[#010606] lg:dark:bg-[#010606] overflow-x-hidden lg:overflow-hidden font-sans flex flex-col lg:block">
            
            {/* ШАГ 2: MODAL CHECKOUT */}
            <AnimatePresence>
                {step === 2 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-[#111111] border border-white/10 p-8 rounded-[32px] max-w-lg w-full shadow-2xl space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Оформление оплаты</h2>
                                <p className="text-gray-400 text-sm">Введите данные (фейк) для активации Premium</p>
                            </div>

                            <form onSubmit={handleCheckout} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Номер карты</label>
                                        <div className="relative">
                                            <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input required type="text" placeholder="**** **** **** ****" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-brand outline-hidden" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Срок</label>
                                            <input required type="text" placeholder="12/30" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-brand outline-hidden text-center" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CVC</label>
                                            <input required type="password" placeholder="***" maxLength={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-brand outline-hidden text-center" />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-brand text-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 disabled:opacity-50 transition-all font-bold"
                                >
                                    {isProcessing ? "Обработка..." : "Оплатить 199₽"}
                                </button>
                                
                                <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-gray-500 uppercase font-bold hover:text-white pb-2">
                                    Отмена
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hover:text-slate-500 transition-colors font-bold text-sm">
                <FaArrowLeft /> На главную
            </Link>

            {/* ГРАФИЧЕСКИЙ ФОН ИЗ ОРИГИНАЛА */}
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

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px][mask-image:radial-gradient(ellipse_75%_75%_at_75%_50%,#000_15%,transparent_100%)] pointer-events-none" />
            </div>

            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden lg:block text-white dark:text-[#0a0a0a]">
                <svg className="w-full h-full block drop-shadow-[20px_0_50px_rgba(0,0,0,0.7)] dark:drop-shadow-[20px_0_60px_rgba(0,0,0,0.95)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
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
                    <polyline points="50,0 45,42 47,49 41,100" fill="none" stroke="url(#glow-line)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="opacity-100" />
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

                <div className="w-full lg:flex-1 min-h-[50vh] lg:min-h-full flex flex-col items-center justify-center p-8 lg:p-12 bg-[#010606] lg:bg-transparent relative">
                    <div className="relative z-10 max-w-md w-full text-white">
                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                                    <RiVipCrownFill className="text-white text-5xl drop-shadow-md" />
                                </motion.div>
                                <div>
                                    <h2 className="text-6xl font-black italic tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-[#a7ffeb]">PREMIUM</h2>
                                    <p className="text-white/80 font-bold tracking-widest text-xs uppercase mt-1">AniYume возможности</p>
                                </div>
                            </div>

                            <p className="text-lg font-medium text-white/95 leading-relaxed">Разблокируй истинный потенциал своего профиля и смотри без границ.</p>

                            <motion.ul variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                                {[
                                    { icon: <HiGif />, t: "GIF Аватарки", d: "Живой профиль" },
                                    { icon: <BsFillPeopleFill />, t: "Совместный просмотр", d: "Смотрите вместе с друзьями" },
                                    { icon: <FaMagic className="text-brand" />, t: "Улучшенный плеер", d: "Отсутствие рекламы и 4K" },
                                    { icon: <HiCursorClick />, t: "Золотой статус", d: "Выделяйся в комментариях" },
                                ].map((item, i) => (
                                    <motion.li key={i} variants={itemVariants} className="flex items-center gap-5 group">
                                        <div className="shrink-0 p-3 rounded-full bg-white/10 text-[#fdfefe] shadow-lg group-hover:bg-white group-hover:text-[#16758a] transition-all duration-300">
                                            <div className="text-xl">{item.icon}</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-white tracking-tight">{item.t}</span>
                                            <span className="text-sm font-medium text-white/60 mt-1">{item.d}</span>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <motion.button
                                onClick={() => setStep(2)}
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4 bg-white text-[#168a7f] py-5 rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl transition-all relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">Получить за 199₽</span>
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                            </motion.button>
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
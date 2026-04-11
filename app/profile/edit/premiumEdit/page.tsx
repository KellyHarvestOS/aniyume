"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaSave, FaPalette, FaCheck } from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineDownloadDone } from "react-icons/md";

export default function PremiumEditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    const [themeType, setThemeType] = useState<'gradient' | 'solid'>('gradient');
    const [profileValue, setProfileValue] = useState("from-[#34dccb] to-[#007492]");

    const gradients = [
        { name: "Лазурный поток", value: "from-[#34dccb] to-[#007492]" },
        { name: "Неоновая страсть", value: "from-[#b80016] to-[#f8079c]" },
        { name: "Космический разлом", value: "from-[#9a00b6] to-[#1500ff]" },
        { name: "Солнечный импульс", value: "from-[#d76800] to-[#e1eb22]" },
        { name: "Тропический яд", value: "from-[#039e00] to-[#c1ff31]" },
        { name: "Пустотная энергия", value: "from-[#230236] to-[#aed7d7]" }
    ];


    const updateGlobalStyles = useCallback((value: string, type: 'gradient' | 'solid') => {
        const root = document.documentElement;
        if (type === 'gradient') {
            const hexColors = value.match(/#[a-fA-F0-9]{6}/g);
            if (hexColors && hexColors.length >= 2) {
                const gradientString = `linear-gradient(90deg, ${hexColors[0]}, ${hexColors[1]})`;
                root.style.setProperty('--brand-gradient', gradientString);
                root.style.setProperty('--brand-main', hexColors[0]);
            }
        } else {
            root.style.setProperty('--brand-gradient', value);
            root.style.setProperty('--brand-main', value);
        }
    }, []);

    useEffect(() => {
        const premiumStatus = localStorage.getItem("isPremium") === "true";
        if (!premiumStatus) {
            router.push("/profile/edit");
            return;
        }
        setIsPremium(true);

        const savedValue = localStorage.getItem("profile_theme_value") || "from-[#2EC4B6] to-[#2193b0]";
        const savedType = localStorage.getItem("profile_theme_type") as 'gradient' | 'solid' || 'gradient';

        setProfileValue(savedValue);
        setThemeType(savedType);
        updateGlobalStyles(savedValue, savedType);
        setLoading(false);
    }, [router, updateGlobalStyles]);

    const handleSave = () => {
        localStorage.setItem("profile_theme_value", profileValue);
        localStorage.setItem("profile_theme_type", themeType);
        updateGlobalStyles(profileValue, themeType);
        alert("Настройки оформления сохранены!");
        router.back();
    };

    const handleValueChange = (value: string, type: 'gradient' | 'solid') => {
        setThemeType(type);
        setProfileValue(value);
        updateGlobalStyles(value, type);
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors">
            <div className="max-w-7xl mx-auto px-2 py-5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#000000] dark:text-white hover:text-brand transition-colors font-bold text-xs uppercase tracking-widest mb-2"
                >
                    <FaChevronLeft /> Назад к настройкам
                </button>

                <div className="flex items-center gap-2 mb-2">
                    <div className="p-4 rounded-xl">
                        <SiCodemagic className="text-5xl text-[#000000] dark:text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                            Кастомизация
                        </h1>
                        <p className="text-slate-500 text-sm font-medium italic">Управление оформлением вашего профиля</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="px-8">
                            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand mb-6">
                                <FaPalette /> Выберите фирменный градиент
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {gradients.map((grad) => (
                                    <button
                                        key={grad.value}
                                        onClick={() => handleValueChange(grad.value, 'gradient')}
                                        className={`relative h-16 rounded-lg bg-gradient-to-r ${grad.value} transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center px-6 shadow-lg ${themeType === 'gradient' && profileValue === grad.value ? "ring-4 ring-brand ring-offset-4 dark:ring-offset-[#0f0f0f]" : "opacity-80"
                                            }`}
                                    >
                                        <span className="text-white font-black uppercase italic text-xs tracking-tighter drop-shadow-md">
                                            {grad.name}
                                        </span>
                                        {themeType === 'gradient' && profileValue === grad.value && (
                                            <FaCheck className="absolute right-6 text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Предпросмотр компонентов</h3>


                        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-zinc-900">
                            <div
                                className={`h-40 w-full transition-all duration-500 ${themeType === 'gradient' ? `bg-gradient-to-r ${profileValue}` : ''}`}
                                style={themeType === 'solid' ? { backgroundColor: profileValue } : {}}
                            />
                            <div className="p-6 relative">
                                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-900 absolute -top-10 left-6 bg-slate-200 shadow-lg" />
                                <div className="mt-12 space-y-3">
                                    <div className="h-4 w-32 bg-slate-100 dark:bg-white/5 rounded-lg" />
                                    <div className="h-3 w-48 bg-slate-50 dark:bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-5 bg-brand text-white dark:text-black font-black uppercase tracking-[0.2em] italic rounded-lg flex items-center justify-center gap-3"
                        >
                            <MdOutlineDownloadDone className="text-2xl" /> Сохранить изменения
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
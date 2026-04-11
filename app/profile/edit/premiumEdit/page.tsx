"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaSave, FaPalette, FaCheck, FaMagic } from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineDownloadDone } from "react-icons/md";

export default function PremiumEditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    const [themeType, setThemeType] = useState<'gradient' | 'solid'>('gradient');
    const [profileValue, setProfileValue] = useState("from-[#34dccb] to-[#007492]");

    // Массив с ключами логотипов
    const gradients = [
        { name: "Лазурный поток", value: "from-[#34dccb] to-[#007492]", logoKey: "AzureFlow" },
        { name: "Неоновая страсть", value: "from-[#b80016] to-[#f8079c]", logoKey: "NeonPassion" },
        { name: "Космический разлом", value: "from-[#9a00b6] to-[#1500ff]", logoKey: "SpaceRift" },
        { name: "Солнечный импульс", value: "from-[#d76800] to-[#e1eb22]", logoKey: "SolarImpulse" },
        { name: "Тропический яд", value: "from-[#039e00] to-[#c1ff31]", logoKey: "TropicalPoison" },
        { name: "Пустотная энергия", value: "from-[#230236] to-[#aed7d7]", logoKey: "VoidEnergy" }
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

        const savedValue = localStorage.getItem("profile_theme_value") || "from-[#34dccb] to-[#007492]";
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

    const handleValueChange = (value: string, type: 'gradient' | 'solid', logoKey: string) => {
        setThemeType(type);
        setProfileValue(value);
        updateGlobalStyles(value, type);

        localStorage.setItem("profile_logo_key", logoKey);
        localStorage.setItem("profile_theme_value", value);
        localStorage.setItem("profile_theme_type", type);

        window.dispatchEvent(new Event('storage'));
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors pb-20">
            <div className="max-w-7xl mx-auto px-4 py-5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#000000] dark:text-white hover:text-brand transition-colors font-bold text-xs uppercase tracking-widest mb-6"
                >
                    <FaChevronLeft /> Назад к настройкам
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 ">
                        <SiCodemagic className="text-5xl text-[#000000] dark:text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                            Кастомизация
                        </h1>
                        <p className="text-slate-500 text-sm font-medium italic tracking-tight">Управление оформлением вашего профиля</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-zinc-900 rounded-[1rem] p-10 shadow-2xl border border-slate-200 dark:border-white/5">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-brand rounded-full" />
                                    <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tight">Выберите стиль</h2>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {gradients.map((grad) => (
                                    <button
                                        key={grad.value}
                                        onClick={() => handleValueChange(grad.value, 'gradient', grad.logoKey)}
                                        className={`group relative aspect-square rounded-3xl transition-all duration-500 ${profileValue === grad.value
                                            ? "scale-100 ring-4 ring-offset-4 dark:ring-offset-[#0a0a0a] ring-brand shadow-2xl"
                                            : "scale-[0.96] hover:scale-100 opacity-70 hover:opacity-100 shadow-lg"
                                            }`}
                                    >
                                        <div className={`absolute inset-0 rounded-[1.4rem] bg-gradient-to-br ${grad.value} shadow-inner`} />

                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                            <span className="text-white font-black uppercase italic text-[10px] tracking-widest leading-tight drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                {grad.name}
                                            </span>
                                            {profileValue === grad.value && (
                                                <div className="mt-2 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 animate-bounce">
                                                    <FaCheck className="text-white text-xs" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-3 left-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <FaMagic className="text-white text-xs" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Предпросмотр компонентов</h3>

                        <div className="rounded-[1rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-zinc-900">
                            <div
                                className={`h-40 w-full transition-all duration-500 ${themeType === 'gradient' ? `bg-gradient-to-r ${profileValue}` : ''}`}
                                style={themeType === 'solid' ? { backgroundColor: profileValue } : {}}
                            />
                            <div className="p-8 relative">
                                <div className="w-24 h-24 rounded-[1rem] border-4 border-white dark:border-zinc-900 absolute -top-12 left-8 bg-zinc-200 dark:bg-zinc-00 shadow-lg" />
                                <div className="mt-14 space-y-4">
                                    <div className="h-5 w-40 bg-slate-100 dark:bg-white/5 rounded-lg" />
                                    <div className="h-3 w-56 bg-slate-50 dark:bg-white/5 rounded-lg" />
                                    <div className="pt-4 grid grid-cols-2 gap-3">
                                        <div className="h-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10" />
                                        <div className="h-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-6 bg-brand text-white dark:text-black font-black uppercase tracking-[0.2em] italic rounded-[2rem] flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                            <MdOutlineDownloadDone className="text-2xl" /> Сохранить изменения
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
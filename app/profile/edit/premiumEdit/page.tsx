"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaSave, FaPalette, FaCheck, FaMagic, FaLock } from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import { MdOutlineDownloadDone } from "react-icons/md";
import { getProfileLevel, ProfileWatchTime } from "@/lib/profileLevel";
import { getAvatarUrl } from "@/lib/storage";
import { getAvatarFrameFit } from "@/lib/avatarFrames";

const TEMP_UNLOCK_ALL_AVATAR_FRAMES = false;

export default function PremiumEditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    const [themeType, setThemeType] = useState<'gradient' | 'solid'>('gradient');
    const [profileValue, setProfileValue] = useState("from-[#34dccb] to-[#007492]");
    const [avatarFrameKey, setAvatarFrameKey] = useState("none");
    const [watchTime, setWatchTime] = useState<ProfileWatchTime>({ days: 0, hours: 0, minutes: 0 });
    const [frameObtainedDates, setFrameObtainedDates] = useState<Record<string, string>>({});
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [previewUserName, setPreviewUserName] = useState("?");

    const avatarFrames = [
        {
            key: "none",
            name: "Без рамки",
            description: "Обычный аватар без дополнительного оформления",
            imagePath: null,
            condition: "Доступно всем Premium",
            canStillObtain: true,
        },
        {
            key: "ramka1000people",
            name: "Первые 1000",
            description: "Рамка для первых 1000 пользователей Premium",
            imagePath: "/images/ramka/ramka1000people.png",
            condition: "Первые 1000 Premium",
            canStillObtain: false,
        },
        {
            key: "ramka1-10lvl",
            name: "Первые шаги",
            description: "Рамка за достижение 1 уровня",
            imagePath: "/images/ramka/ramka1-10lvl.png",
            condition: "Уровень 1+",
            minLevel: 1,
            canStillObtain: true,
        },
        {
            key: "ramka11-20lvl",
            name: "Смотрящий",
            description: "Рамка за достижение 11 уровня",
            imagePath: "/images/ramka/ramka11-20lvl.png",
            condition: "Уровень 11+",
            minLevel: 11,
            canStillObtain: true,
        },
        {
            key: "ramka21-30lvl",
            name: "Коллекционер серий",
            description: "Рамка за достижение 21 уровня",
            imagePath: "/images/ramka/ramka21-30lvl.png",
            condition: "Уровень 21+",
            minLevel: 21,
            canStillObtain: true,
        },
        {
            key: "ramka31-40lvl",
            name: "Марафонец",
            description: "Рамка за достижение 31 уровня",
            imagePath: "/images/ramka/ramka31-40lvl.png",
            condition: "Уровень 31+",
            minLevel: 31,
            canStillObtain: true,
        },
        {
            key: "ramka41-50lvl",
            name: "Ветеран онгоингов",
            description: "Рамка за достижение 41 уровня",
            imagePath: "/images/ramka/ramka41-50lvl.png",
            condition: "Уровень 41+",
            minLevel: 41,
            canStillObtain: true,
        },
        {
            key: "ramka51-60lvl",
            name: "Хранитель коллекции",
            description: "Рамка за достижение 51 уровня",
            imagePath: "/images/ramka/ramka51-60lvl.png",
            condition: "Уровень 51+",
            minLevel: 51,
            canStillObtain: true,
        },
        {
            key: "ramka61-70lvl",
            name: "Обсидиановый ранг",
            description: "Рамка за достижение 61 уровня",
            imagePath: "/images/ramka/ramka61-70lvl.png",
            condition: "Уровень 61+",
            minLevel: 61,
            canStillObtain: true,
        },
        {
            key: "ramka67",
            name: "Секретная рамка",
            description: "Особая рамка со скрытым способом получения",
            imagePath: "/images/ramka/ramka67.png",
            condition: "Условия скрыты",
            canStillObtain: true,
            secret: true,
        },
    ];

    // Массив с ключами логотипов
    const gradients = [
        { name: "Лазурный поток", value: "from-[#34dccb] to-[#007492]", logoKey: "AzureFlow", cursorKey: "default", cursorPath: "/images/cursor/Mouse-cursor.png" },
        { name: "Неоновая страсть", value: "from-[#b80016] to-[#f8079c]", logoKey: "NeonPassion", cursorKey: "red", cursorPath: "/images/cursor/redMouse-cursor.png" },
        { name: "Космический разлом", value: "from-[#9a00b6] to-[#1500ff]", logoKey: "SpaceRift", cursorKey: "purple", cursorPath: "/images/cursor/purpleMouse-cursor.png" },
        { name: "Солнечный импульс", value: "from-[#d76800] to-[#e1eb22]", logoKey: "SolarImpulse", cursorKey: "yellow", cursorPath: "/images/cursor/yellowMouse-cursor.png" },
        { name: "Тропический яд", value: "from-[#039e00] to-[#c1ff31]", logoKey: "TropicalPoison", cursorKey: "green", cursorPath: "/images/cursor/greenMouse-cursor.png" },
        { name: "Пустотная энергия", value: "from-[#230236] to-[#aed7d7]", logoKey: "VoidEnergy", cursorKey: "gray", cursorPath: "/images/cursor/grayMouse-cursor.png" }
    ];

    const updateGlobalStyles = useCallback((value: string, type: 'gradient' | 'solid', cursorPath?: string, cursorKey?: string) => {
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

        if (cursorPath) {
            root.style.setProperty('--premium-cursor', `url('${cursorPath}') 4 4`);
        }

        if (cursorKey) {
            root.dataset.premiumCursor = cursorKey;
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
        const savedCursor = localStorage.getItem("profile_cursor_path") || "/images/cursor/Mouse-cursor.png";
        const savedCursorKey = localStorage.getItem("profile_cursor_key") || "default";
        const savedFrame = localStorage.getItem("profile_avatar_frame_key") || "none";
        const savedFrameDates = localStorage.getItem("profile_avatar_frame_obtained_dates");

        setProfileValue(savedValue);
        setThemeType(savedType);
        setAvatarFrameKey(savedFrame);
        setFrameObtainedDates(savedFrameDates ? JSON.parse(savedFrameDates) : {});
        updateGlobalStyles(savedValue, savedType, savedCursor, savedCursorKey);
        setLoading(false);

        const token = localStorage.getItem("userToken");
        fetch("/api/external/profile/me", {
            headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const user = data.user || data;
                setWatchTime(data.watch_time || { days: 0, hours: 0, minutes: 0 });
                setPreviewUserName(user?.name || "?");
                setPreviewAvatarUrl(getAvatarUrl(user?.avatar || user?.avatar_url));
            })
            .catch(() => {});
    }, [router, updateGlobalStyles]);

    const handleSave = () => {
        localStorage.setItem("profile_theme_value", profileValue);
        localStorage.setItem("profile_theme_type", themeType);
        localStorage.setItem("profile_avatar_frame_key", avatarFrameKey);
        const savedCursor = localStorage.getItem("profile_cursor_path") || "/images/cursor/Mouse-cursor.png";
        const savedCursorKey = localStorage.getItem("profile_cursor_key") || "default";
        updateGlobalStyles(profileValue, themeType, savedCursor, savedCursorKey);
        alert("Настройки оформления сохранены!");
        router.back();
    };

    const handleValueChange = (value: string, type: 'gradient' | 'solid', logoKey: string, cursorPath: string, cursorKey: string) => {
        setThemeType(type);
        setProfileValue(value);
        updateGlobalStyles(value, type, cursorPath, cursorKey);

        localStorage.setItem("profile_logo_key", logoKey);
        localStorage.setItem("profile_cursor_path", cursorPath);
        localStorage.setItem("profile_cursor_key", cursorKey);
        localStorage.setItem("profile_theme_value", value);
        localStorage.setItem("profile_theme_type", type);

        window.dispatchEvent(new Event('storage'));
    };

    const selectedFrame = avatarFrames.find((frame) => frame.key === avatarFrameKey) || avatarFrames[0];
    const selectedFrameFit = getAvatarFrameFit(selectedFrame.key);
    const currentLevel = getProfileLevel(watchTime);

    const isFrameUnlocked = (frame: (typeof avatarFrames)[number]) => {
        if (TEMP_UNLOCK_ALL_AVATAR_FRAMES) return true;
        if (frame.key === "none") return true;
        if (frame.secret) return Boolean(frameObtainedDates[frame.key]);
        if (frame.key === "ramka1000people") return Boolean(frameObtainedDates[frame.key]);
        return typeof frame.minLevel === "number" ? currentLevel >= frame.minLevel : false;
    };

    const getFrameStatus = (frame: (typeof avatarFrames)[number], unlocked: boolean) => {
        if (frame.key === "none") return "Доступно";
        if (unlocked) return "Получено";
        if (frame.secret) return "Можно получить";
        return frame.canStillObtain ? "Можно получить" : "Уже нельзя получить";
    };

    const saveFrameObtainedDate = (frameKey: string) => {
        if (frameKey === "none" || frameObtainedDates[frameKey]) return frameObtainedDates;

        const nextDates = {
            ...frameObtainedDates,
            [frameKey]: new Date().toISOString(),
        };

        setFrameObtainedDates(nextDates);
        localStorage.setItem("profile_avatar_frame_obtained_dates", JSON.stringify(nextDates));
        return nextDates;
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
                                        onClick={() => handleValueChange(grad.value, 'gradient', grad.logoKey, grad.cursorPath, grad.cursorKey)}
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

                            <div className="mt-12 border-t border-slate-200 pt-10 dark:border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tight">Рамки аватара</h2>
                                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Особые рамки за условия и события
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {avatarFrames.map((frame) => {
                                        const isSelected = avatarFrameKey === frame.key;
                                        const isUnlocked = isFrameUnlocked(frame);
                                        const obtainedDate = frameObtainedDates[frame.key];

                                        return (
                                            <button
                                                key={frame.key}
                                                type="button"
                                                onClick={() => {
                                                    if (!isUnlocked) return;

                                                    const nextDates = saveFrameObtainedDate(frame.key);
                                                    setAvatarFrameKey(frame.key);
                                                    localStorage.setItem("profile_avatar_frame_key", frame.key);
                                                    if (frame.imagePath) {
                                                        localStorage.setItem("profile_avatar_frame_path", frame.imagePath);
                                                    } else {
                                                        localStorage.removeItem("profile_avatar_frame_path");
                                                    }
                                                    setFrameObtainedDates(nextDates);
                                                    window.dispatchEvent(new Event("storage"));
                                                }}
                                                disabled={!isUnlocked}
                                                className={`group flex items-center gap-4 rounded-3xl border p-4 text-left transition-all ${isSelected
                                                    ? "border-brand bg-slate-100 ring-2 ring-brand/20 active:bg-slate-100 dark:border-brand/70 dark:bg-zinc-800 dark:ring-brand/30 dark:active:bg-zinc-800"
                                                    : "border-slate-200 bg-slate-50 hover:border-brand/40 dark:border-white/10 dark:bg-[#111111] dark:hover:border-brand/50"
                                                    } ${!isUnlocked ? "cursor-not-allowed opacity-75 hover:border-slate-200 dark:hover:border-white/10" : ""}`}
                                            >
                                                <div className="relative h-20 w-20 shrink-0 rounded-2xl border border-slate-200 bg-zinc-200 dark:border-white/10 dark:bg-zinc-900">
                                                    <div className="absolute inset-3 rounded-full bg-linear-to-br from-slate-300 to-slate-100 dark:from-zinc-700 dark:to-zinc-950" />
                                                    {frame.imagePath ? (
                                                        <img
                                                            src={frame.imagePath}
                                                            alt=""
                                                            className="absolute inset-0 h-full w-full object-contain"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 rounded-2xl border border-dashed border-slate-300 dark:border-white/10" />
                                                    )}
                                                    {!isUnlocked && (
                                                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/45 dark:bg-black/35">
                                                            <FaLock className="text-slate-500 dark:text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">{frame.name}</p>
                                                        {isSelected && <FaCheck className="shrink-0 text-brand text-xs" />}
                                                    </div>
                                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{frame.description}</p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <p className="inline-flex rounded-xl bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 border border-slate-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-slate-200">
                                                            {frame.condition}
                                                        </p>
                                                        <p className={`inline-flex rounded-xl px-2 py-1 text-[10px] font-black uppercase tracking-wider border ${isUnlocked
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                            : frame.canStillObtain
                                                                ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
                                                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                                                            }`}>
                                                            {getFrameStatus(frame, isUnlocked)}
                                                        </p>
                                                    </div>
                                                    {obtainedDate && (
                                                        <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                                            Получено: {new Date(obtainedDate).toLocaleDateString("ru-RU")}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:self-start">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">Предпросмотр компонентов</h3>

                        <div className="rounded-[1rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-zinc-900">
                            <div
                                className={`h-40 w-full transition-all duration-500 ${themeType === 'gradient' ? `bg-gradient-to-r ${profileValue}` : ''}`}
                                style={themeType === 'solid' ? { backgroundColor: profileValue } : {}}
                            />
                            <div className="p-8 relative">
                                <div className={`w-24 h-24 rounded-full absolute -top-12 left-8 bg-zinc-200 dark:bg-zinc-800 shadow-lg ${selectedFrame.imagePath ? "border-0" : "border-4 border-white dark:border-zinc-900"}`}>
                                    {previewAvatarUrl ? (
                                        <img
                                            src={previewAvatarUrl}
                                            alt="avatar"
                                            className="absolute inset-0 h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-brand text-3xl font-black text-white">
                                            {previewUserName[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    {selectedFrame.imagePath && (
                                        <div
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            style={{
                                                height: selectedFrameFit.height || selectedFrameFit.size,
                                                width: selectedFrameFit.width || selectedFrameFit.size,
                                                marginLeft: selectedFrameFit.x || "0px",
                                                marginTop: selectedFrameFit.y || "0px",
                                            }}
                                        >
                                            <img
                                                src={selectedFrame.imagePath}
                                                alt=""
                                                className="h-full w-full object-contain"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
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
                            className="w-full py-6 bg-brand text-white dark:text-black font-black uppercase tracking-[0.2em] italic rounded-[1rem] flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                            <MdOutlineDownloadDone className="text-2xl" /> Сохранить изменения
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

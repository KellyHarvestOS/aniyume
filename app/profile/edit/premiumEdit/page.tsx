"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import { getProfileLevel, ProfileWatchTime } from "@/lib/profileLevel";
import { getAvatarUrl } from "@/lib/storage";

import { avatarFrames } from "./constants";
import ThemeSelector from "./ThemeSelector";
import FrameSelector from "./FrameSelector";
import ProfilePreview from "./ProfilePreview";

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
                if (user?.selected_profile_frame) {
                    setAvatarFrameKey(user.selected_profile_frame);
                    localStorage.setItem("profile_avatar_frame_key", user.selected_profile_frame);
                    const selected = avatarFrames.find((frame) => frame.key === user.selected_profile_frame);
                    if (selected?.imagePath) localStorage.setItem("profile_avatar_frame_path", selected.imagePath);
                    else localStorage.removeItem("profile_avatar_frame_path");
                }
                if (Array.isArray(data.profile_frames)) {
                    const unlockedDates = data.profile_frames.reduce((acc: Record<string, string>, frame: any) => {
                        if (frame.unlocked) acc[frame.key] = frame.obtained_at || new Date().toISOString();
                        return acc;
                    }, {});
                    setFrameObtainedDates((prev) => ({ ...unlockedDates, ...prev }));
                    localStorage.setItem("profile_avatar_frame_obtained_dates", JSON.stringify({ ...unlockedDates, ...frameObtainedDates }));
                }
            })
            .catch(() => { });
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

    const handleFrameSelect = (frame: typeof avatarFrames[number]) => {
        const nextDates = { ...frameObtainedDates };
        if (frame.key !== "none" && !frameObtainedDates[frame.key]) {
            nextDates[frame.key] = new Date().toISOString();
            setFrameObtainedDates(nextDates);
            localStorage.setItem("profile_avatar_frame_obtained_dates", JSON.stringify(nextDates));
        }

        setAvatarFrameKey(frame.key);
        localStorage.setItem("profile_avatar_frame_key", frame.key);
        
        if (frame.imagePath) {
            localStorage.setItem("profile_avatar_frame_path", frame.imagePath);
        } else {
            localStorage.removeItem("profile_avatar_frame_path");
        }

        const token = localStorage.getItem("userToken");
        fetch("/api/external/profile/me/frames/select", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ frame_key: frame.key }),
        }).catch(() => {});

        window.dispatchEvent(new Event("storage"));
    };

    if (loading) return null;

    const selectedFrame = avatarFrames.find((frame) => frame.key === avatarFrameKey) || avatarFrames[0];
    const currentLevel = getProfileLevel(watchTime);

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
                            <ThemeSelector 
                                profileValue={profileValue} 
                                onSelect={handleValueChange} 
                            />
                            
                            <FrameSelector 
                                avatarFrameKey={avatarFrameKey}
                                currentLevel={currentLevel}
                                frameObtainedDates={frameObtainedDates}
                                onSelectFrame={handleFrameSelect}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <ProfilePreview 
                            themeType={themeType}
                            profileValue={profileValue}
                            previewAvatarUrl={previewAvatarUrl}
                            previewUserName={previewUserName}
                            selectedFrame={selectedFrame}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

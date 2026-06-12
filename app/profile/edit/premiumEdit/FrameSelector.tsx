"use client";
import React, { useState } from "react";
import { FaCheck, FaLock } from "react-icons/fa";
import { avatarFrames, TEMP_UNLOCK_ALL_AVATAR_FRAMES } from "./constants";
import { useI18n } from "@/contexts/I18nContext";

interface FrameSelectorProps {
    avatarFrameKey: string;
    currentLevel: number;
    frameObtainedDates: Record<string, string>;
    onSelectFrame: (frame: typeof avatarFrames[number]) => void;
}

type Category = 'all' | 'level' | 'secret' | 'other';

export default function FrameSelector({ avatarFrameKey, currentLevel, frameObtainedDates, onSelectFrame }: FrameSelectorProps) {
    const { t } = useI18n();
    const [activeCategory, setActiveCategory] = useState<Category>('all');

    const categories: { id: Category; label: string }[] = [
        { id: 'all', label: t('frameSel.catAll') },
        { id: 'level', label: t('frameSel.catLevel') },
        { id: 'secret', label: t('frameSel.catSecret') },
        { id: 'other', label: t('frameSel.catOther') }
    ];

    const isFrameUnlocked = (frame: typeof avatarFrames[number]) => {
        if (TEMP_UNLOCK_ALL_AVATAR_FRAMES) return true;
        if (frame.key === "none") return true;
        if (frame.secret) return Boolean(frameObtainedDates[frame.key]);
        if (frame.key === "ramka1000people") return Boolean(frameObtainedDates[frame.key]);
        return typeof frame.minLevel === "number" ? currentLevel >= frame.minLevel : false;
    };

    const getFrameStatus = (frame: typeof avatarFrames[number], unlocked: boolean) => {
        if (frame.key === "none") return t('frameSel.available');
        if (unlocked) return t('frameSel.obtained');
        if (frame.secret) return t('frameSel.obtainable');
        return frame.canStillObtain ? t('frameSel.obtainable') : t('frameSel.noLonger');
    };

    const filteredFrames = avatarFrames.filter(frame => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'level') return typeof frame.minLevel === 'number';
        if (activeCategory === 'secret') return frame.secret === true;
        if (activeCategory === 'other') return typeof frame.minLevel !== 'number' && !frame.secret;
        return true;
    });

    return (
        <div className="mt-12 border-t border-slate-200 pt-10 dark:border-white/5">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes smoothFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tight">{t('frameSel.title')}</h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                        {t('frameSel.subtitle')}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                            activeCategory === cat.id
                                ? "bg-brand text-white shadow-lg"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div 
                key={activeCategory} 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}
            >
                {filteredFrames.map((frame) => {
                    const isSelected = avatarFrameKey === frame.key;
                    const isUnlocked = isFrameUnlocked(frame);
                    const obtainedDate = frameObtainedDates[frame.key];

                    return (
                        <button
                            key={frame.key}
                            type="button"
                            onClick={() => {
                                if (isUnlocked) onSelectFrame(frame);
                            }}
                            disabled={!isUnlocked}
                            className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${
                               isSelected
                                     ? "border-brand ring-2 ring-brand/20 shadow-md bg-zinc-900 dark:bg-zinc-800"
                                    : "border-slate-200 bg-slate-50  dark:border-white/10 dark:bg-[#111111] dark:hover:border-brand/50"
                            } ${!isUnlocked ? "cursor-not-allowed opacity-75 hover:translate-y-0 hover:shadow-none hover:border-slate-200 dark:hover:border-white/10" : ""}`}
                        >
                            <div className="relative h-20 w-20 shrink-0 rounded-2xl border border-slate-200 bg-zinc-200 dark:border-white/10 dark:bg-zinc-900 overflow-hidden">
                                <div className="absolute inset-3 rounded-full bg-linear-to-br from-slate-300 to-slate-100 dark:from-zinc-700 dark:to-zinc-950 transition-transform duration-300 group-hover:scale-110" />
                                {frame.imagePath ? (
                                    <img
                                        src={frame.imagePath}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 "
                                        onError={(event) => { event.currentTarget.style.display = "none"; }}
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
                                    <p className="truncate text-sm font-black text-slate-900 dark:text-white transition-colors duration-300 ">{t(frame.name)}</p>
                                    {isSelected && <FaCheck className="shrink-0 text-brand text-xs" />}
                                </div>
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t(frame.description)}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <p className="inline-flex rounded-xl bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 border border-slate-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-slate-200">
                                        {t(frame.condition)}
                                    </p>
                                    <p className={`inline-flex rounded-xl px-2 py-1 text-[10px] font-black uppercase tracking-wider border ${
                                        isUnlocked
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
                                        {t('frameSel.obtainedOn', { date: new Date(obtainedDate).toLocaleDateString() })}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {filteredFrames.length === 0 && (
                <div 
                    className="py-10 text-center"
                    style={{ animation: 'smoothFadeIn 0.3s ease-out forwards' }}
                >
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('frameSel.emptyCategory')}</p>
                </div>
            )}
        </div>
    );
}
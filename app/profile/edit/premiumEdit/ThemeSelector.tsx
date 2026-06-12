"use client";
import React from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { gradients } from "./constants";
import { useI18n } from "@/contexts/I18nContext";

interface ThemeSelectorProps {
    profileValue: string;
    onSelect: (value: string, type: 'gradient' | 'solid', logoKey: string, cursorPath: string, cursorKey: string) => void;
}

export default function ThemeSelector({ profileValue, onSelect }: ThemeSelectorProps) {
    const { t } = useI18n();
    return (
        <div>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-brand rounded-full" />
                    <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tight">{t('themeSel.title')}</h2>
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
                        onClick={() => onSelect(grad.value, 'gradient', grad.logoKey, grad.cursorPath, grad.cursorKey)}
                        className={`group relative aspect-square rounded-3xl transition-all duration-500 ${profileValue === grad.value
                            ? "scale-100 ring-4 ring-offset-4 dark:ring-offset-[#0a0a0a] ring-brand shadow-2xl"
                            : "scale-[0.96] hover:scale-100 opacity-70 hover:opacity-100 shadow-lg"
                            }`}
                    >
                        <div className={`absolute inset-0 rounded-[1.4rem] bg-gradient-to-br ${grad.value} shadow-inner`} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-white font-black uppercase italic text-[10px] tracking-widest leading-tight drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                {t(grad.name)}
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
    );
}
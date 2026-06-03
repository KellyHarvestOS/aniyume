"use client";
import React from "react";
import { MdOutlineDownloadDone } from "react-icons/md";
import { avatarFrames } from "./constants";
import { getAvatarFrameFit } from "@/lib/avatarFrames";

interface ProfilePreviewProps {
    themeType: 'gradient' | 'solid';
    profileValue: string;
    previewAvatarUrl: string | null;
    previewUserName: string;
    selectedFrame: typeof avatarFrames[number];
    onSave: () => void;
}

export default function ProfilePreview({ themeType, profileValue, previewAvatarUrl, previewUserName, selectedFrame, onSave }: ProfilePreviewProps) {
    const selectedFrameFit = getAvatarFrameFit(selectedFrame.key);

    return (
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
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
                                    onError={(event) => { event.currentTarget.style.display = "none"; }}
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
                onClick={onSave}
                className="w-full py-6 bg-brand text-white dark:text-black font-black uppercase tracking-[0.2em] italic rounded-[1rem] flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
            >
                <MdOutlineDownloadDone className="text-2xl" /> Сохранить изменения
            </button>
        </div>
    );
}
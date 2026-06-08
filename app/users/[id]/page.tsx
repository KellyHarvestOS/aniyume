'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUserPlus, FaUserCheck, FaClock } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageAssetUrl } from '@/lib/storage';
import { avatarFrames } from '@/app/profile/edit/premiumEdit/constants';

type FriendStatus = 'none' | 'pending' | 'accepted';

interface UserProfile {
    user: {
        id: number;
        name: string;
        avatar: string | null;
        custom_status: string | null;
        is_online: boolean;
        is_premium?: boolean;
        selected_profile_frame?: string | null;
        created_at?: string | null;
        friendship_status?: FriendStatus;
        is_sender?: boolean | null;
    };
    counts: {
        friends: number;
        comments: number;
        ratings: number;
        favorites: number;
    };
}

const framePath = (key?: string | null): string | null => {
    if (!key || key === 'none') return null;
    return avatarFrames.find(f => f.key === key)?.imagePath ?? null;
};

export default function UserProfilePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user: me, isLoading: authLoading } = useAuth();
    const userId = params?.id;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!authLoading && !me) {
            router.push('/login');
        }
    }, [me, authLoading, router]);

    const loadProfile = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setNotFound(false);
        try {
            const res = await api.get(`/users/${userId}/profile`);
            if (!res.ok) {
                setNotFound(true);
                return;
            }
            const data = await res.json();
            setProfile(data);
        } catch {
            setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (me && userId) loadProfile();
    }, [me, userId, loadProfile]);

    const patchStatus = (status: FriendStatus, isSender: boolean | null = null) => {
        setProfile(prev => prev ? { ...prev, user: { ...prev.user, friendship_status: status, is_sender: isSender } } : prev);
    };

    const sendRequest = async () => {
        if (!profile) return;
        setActionLoading(true);
        try {
            const res = await api.post(`/friends/${profile.user.id}`, {});
            if (res.ok) patchStatus('pending', true);
        } finally {
            setActionLoading(false);
        }
    };

    const acceptRequest = async () => {
        if (!profile) return;
        setActionLoading(true);
        try {
            const res = await api.post(`/friends/${profile.user.id}/accept`, {});
            if (res.ok) {
                patchStatus('accepted', false);
                setProfile(prev => prev ? { ...prev, counts: { ...prev.counts, friends: prev.counts.friends + 1 } } : prev);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const removeOrCancel = async () => {
        if (!profile) return;
        setActionLoading(true);
        try {
            const wasFriend = profile.user.friendship_status === 'accepted';
            const res = await api.post(`/friends/${profile.user.id}/decline`, {});
            if (res.ok) {
                patchStatus('none', null);
                if (wasFriend) setProfile(prev => prev ? { ...prev, counts: { ...prev.counts, friends: Math.max(0, prev.counts.friends - 1) } } : prev);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const getAvatar = () => {
        const u = profile?.user;
        if (!u) return '';
        if (u.avatar) {
            return getStorageAssetUrl(u.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
        }
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
            </div>
        );
    }

    if (notFound || !profile) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#111111] flex flex-col items-center justify-center gap-6">
                <p className="text-2xl font-black uppercase italic text-gray-400 tracking-tighter">
                    Пользователь <span className="text-brand">не найден</span>
                </p>
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors">
                    <FaArrowLeft size={12} /> Назад
                </button>
            </div>
        );
    }

    const u = profile.user;
    const c = profile.counts;
    const frame = framePath(u.selected_profile_frame);
    const isSelf = me?.id === u.id;

    const renderAction = () => {
        if (isSelf) return null;
        if (u.friendship_status === 'accepted') {
            return (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="flex-1 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                        <FaUserCheck /> В друзьях
                    </div>
                    <button onClick={removeOrCancel} disabled={actionLoading} className="flex-1 h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                        Удалить из друзей
                    </button>
                </div>
            );
        }
        if (u.friendship_status === 'pending' && u.is_sender) {
            return (
                <button onClick={removeOrCancel} disabled={actionLoading} className="w-full h-12 bg-white/5 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-red-500 transition-all disabled:opacity-50">
                    <FaClock /> Отменить заявку
                </button>
            );
        }
        if (u.friendship_status === 'pending' && !u.is_sender) {
            return (
                <div className="flex gap-3 w-full">
                    <button onClick={acceptRequest} disabled={actionLoading} className="flex-1 h-12 bg-brand text-white dark:text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50">
                        Принять заявку
                    </button>
                    <button onClick={removeOrCancel} disabled={actionLoading} className="flex-1 h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                        Отклонить
                    </button>
                </div>
            );
        }
        return (
            <button onClick={sendRequest} disabled={actionLoading} className="w-full h-12 bg-transparent border-2 border-brand text-brand hover:bg-brand hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <FaUserPlus /> Добавить в друзья
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#111111] transition-colors pb-16 relative overflow-hidden">
            <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 md:px-20 pt-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand transition-colors mb-8">
                    <FaArrowLeft size={12} /> Назад
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto bg-white dark:bg-[#161616] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8 md:p-10 text-center relative"
                >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <img src={getAvatar()} alt={u.name} className="w-full h-full rounded-full object-cover border-4 border-brand/20 bg-gray-50 dark:bg-white/5" />
                        {frame && (
                            <img src={frame} alt="" className="absolute inset-0 w-full h-full object-contain scale-[1.35] pointer-events-none" />
                        )}
                        {u.is_online && <span className="absolute bottom-2 right-2 w-5 h-5 bg-brand rounded-full border-4 border-white dark:border-[#161616]" />}
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">{u.name}</h1>
                        {u.is_premium && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">Premium</span>
                        )}
                    </div>

                    <p className="mt-2 text-sm font-bold text-gray-400">
                        {u.custom_status || (u.is_online ? 'В сети' : 'Не в сети')}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        ID: {u.id}{u.created_at ? ` • С нами с ${new Date(u.created_at).toLocaleDateString('ru-RU')}` : ''}
                    </p>

                    <div className="grid grid-cols-4 gap-2 my-8">
                        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3"><p className="text-brand font-black text-lg">{c.friends}</p><p className="text-[9px] uppercase text-gray-400 tracking-widest">Друзья</p></div>
                        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3"><p className="text-brand font-black text-lg">{c.comments}</p><p className="text-[9px] uppercase text-gray-400 tracking-widest">Комм.</p></div>
                        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3"><p className="text-brand font-black text-lg">{c.ratings}</p><p className="text-[9px] uppercase text-gray-400 tracking-widest">Оценки</p></div>
                        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3"><p className="text-brand font-black text-lg">{c.favorites}</p><p className="text-[9px] uppercase text-gray-400 tracking-widest">Избр.</p></div>
                    </div>

                    {renderAction()}
                </motion.div>
            </div>
        </div>
    );
}

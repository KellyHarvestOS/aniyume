'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaGlobe } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { WatchDynamics } from '@/components/profile/WatchDynamics';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user: me, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !me) router.push('/login');
  }, [authLoading, me, router]);

  const loadProfile = useCallback(async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const response = await api.get(`/users/${params.id}/profile`);
      setProfile(response.ok ? await response.json() : null);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (me) loadProfile();
  }, [me, loadProfile]);

  if (loading) return <ProfileSkeleton />;
  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex flex-col items-center justify-center gap-5">
        <p className="text-xl font-black text-slate-500">Пользователь не найден</p>
        <button onClick={() => router.back()} className="text-brand font-bold">Вернуться назад</button>
      </div>
    );
  }

  const counts = {
    favorites: profile.counts?.favorites || 0,
    ratings: profile.counts?.ratings || 0,
    comments: profile.counts?.comments || 0,
    watch_history: profile.counts?.watch_history || 0,
    friends: profile.counts?.friends || 0,
  };
  const socialLinks: string[] = Array.isArray(profile.user?.social_links) ? profile.user.social_links : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111111] pb-16 transition-colors">
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand">
          <FaArrowLeft /> Назад
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <ProfileCard
              user={profile.user}
              counts={counts}
              watchTime={profile.watch_time}
              editable={false}
            />
            {socialLinks.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-[#161616]">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Социальные сети</p>
                <div className="space-y-2">
                  {socialLinks.map((link) => (
                    <a key={link} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 truncate text-sm font-bold text-brand hover:underline">
                      <FaGlobe className="shrink-0" /> {link.replace(/^https?:\/\//, '')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-9 space-y-6">
            <StatsOverview stats={profile.stats || {}} watchTime={profile.watch_time || { days: 0, hours: 0, minutes: 0, total_seconds: 0 }} historyCount={counts.watch_history} />
            <WatchDynamics dynamics={profile.watch_dynamics || []} />
            <RecentActivity activity={profile.recently_watched || []} />
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { StatsOverview } from "@/components/profile/StatsOverview";
import { WatchDynamics } from "@/components/profile/WatchDynamics";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [statsSummary, setStatsSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [profileRes, statsRes] = await Promise.all([
          fetch("/api/external/profile/me", { headers }),
          fetch("/api/external/statistics/me/episodes-summary", { headers }),
        ]);

        // if (profileRes.status === 401) {
        //   localStorage.removeItem("userToken");
        //   router.push("/login");
        //   return;
        // }

        const profileJson = await profileRes.json();
        const statsJson = await statsRes.json();

        setData(profileJson);
        setStatsSummary(statsJson.data || statsJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  const user = data.user || data;
  const counts = {
    favorites: data.counts?.favorites || 0,
    ratings: data.counts?.ratings || 0,
    comments: data.counts?.comments || 0,
    watch_history: data.counts?.watch_history || 0,
    friends: data.counts?.friends || 0,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111111] pb-16 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ProfileCard
              user={user}
              counts={counts}
              onLogout={handleLogout}
            />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <StatsOverview
              stats={data.stats || {}}
              watchTime={data.watch_time || { days: 0, hours: 0, minutes: 0 }}
              historyCount={counts.watch_history}
            />

            <WatchDynamics
              dynamics={statsSummary?.episodes_per_day_last_10_days || []}
            />

            {data.recently_watched && data.recently_watched.length > 0 && (
              <RecentActivity activity={data.recently_watched} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
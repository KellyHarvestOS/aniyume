"use client";

import React from "react";
import Link from "next/link";
import { RiVipCrownFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { Heart, Star, MessageCircle, Users } from "lucide-react";
import { getAvatarUrl } from "@/lib/storage";
import ProfileLevelBadge, { ProfileWatchTime } from "@/components/profile/ProfileLevelBadge";
import { getAvatarFrameFit } from "@/lib/avatarFrames";
import { avatarFrames } from "@/app/profile/edit/premiumEdit/constants";

interface ProfileCardProps {
  user: {
    name: string;
    avatar: string | null;
    custom_status: string | null;
    created_at: string;
    is_premium?: boolean;
    selected_profile_frame?: string | null;
    is_online?: boolean;
  };
  counts: {
    favorites: number;
    ratings: number;
    comments: number;
    friends: number;
  };
  watchTime?: ProfileWatchTime | null;
  onLogout?: () => void;
  editable?: boolean;
}

export const ProfileCard = ({
  user,
  counts,
  watchTime,
  onLogout,
  editable = true,
}: ProfileCardProps) => {
  const avatarUrl = getAvatarUrl(user.avatar);
  const avatarFrameKey = user.selected_profile_frame || "none";
  const avatarFramePath = avatarFrames.find((frame) => frame.key === avatarFrameKey)?.imagePath || null;
  const hasAvatarFrame = Boolean(avatarFramePath);
  const avatarFrameFit = getAvatarFrameFit(avatarFrameKey);

  return (
    <div className="bg-white dark:bg-[#161616] rounded-lg shadow-sm border border-slate-100 dark:border-gray-800 text-center sticky top-24 relative overflow-hidden">

      {user.is_premium && (
        <div className="absolute top-0 left-0 w-full h-[230px] bg-brand z-0" />
      )}

      <ProfileLevelBadge watchTime={watchTime} className="absolute left-3 top-3 z-20" />

      <div className="relative z-10 p-6">
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="relative w-32 h-32 mx-auto mb-4">
          {user.is_premium && (
            <div className="absolute -top-0.2 -right-0.5 z-20 flex items-center justify-center bg-brand p-1.5 rounded-full border-2! border-white! dark:border-[#161616]! shadow-lg shadow-teal-500/40 animate-bounce transition-transform">
              <RiVipCrownFill className="text-white text-sm" />
            </div>
          )}

          {user.avatar ? (
            <img
              src={avatarUrl!}
              alt="avatar"
              className={`w-full h-full rounded-full object-cover shadow-lg ${hasAvatarFrame
                ? "border-0"
                : `border-4 dark:border-[#1d1d1d] ${user.is_premium
                  ? "border-white"
                  : "border-white dark:border-gray-800"
                }`
                }`}
            />
          ) : (
            <div className={`w-full h-full rounded-full bg-brand flex items-center justify-center text-white text-5xl font-bold shadow-lg ${hasAvatarFrame ? "border-0" : "border-4! border-white! dark:border-black/80!"}`}>
              {user.name ? user.name[0].toUpperCase() : "?"}
            </div>
          )}

          {avatarFramePath && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                height: avatarFrameFit.height || avatarFrameFit.size,
                width: avatarFrameFit.width || avatarFrameFit.size,
                marginLeft: avatarFrameFit.x || "0px",
                marginTop: avatarFrameFit.y || "0px",
              }}
            >
              <img
                src={avatarFramePath}
                alt=""
                className="h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div className={`absolute bottom-2 right-2 w-5 h-5 ${user.is_online === false ? "bg-gray-400" : "bg-green-500"} border-4 border-white dark:border-black/70 rounded-full z-10`} />
        </div>

        <h2
          className={`text-xl font-black mt-2 ${user.is_premium ? "text-white" : "text-slate-900 dark:text-white"
            }`}
        >
          {user.name || "Пользователь"}
        </h2>

        <p className={`text-sm w-40 mx-auto font-bold mt-1 text-black dark:text-gray-100 italic ${user.is_premium ? "text-white" : "text-black"}`}>
          {user.custom_status || "Cтатус отсутствует"}
        </p>




        <div className="grid grid-cols-2 gap-2 my-6">
          {([
            { href: "/bookmarks", value: counts.favorites, Icon: Heart, label: "Избранное" },
            { href: "/profile/ratings", value: counts.ratings, Icon: Star, label: "Оценки" },
            { href: "/profile/comments", value: counts.comments || 0, Icon: MessageCircle, label: "Комменты" },
            { href: "/profile/friends", value: counts.friends || 0, Icon: Users, label: "Друзья" },
          ] as const).map(({ href, value, Icon, label }) => {
            const cardContent = (
              <>
                <p className="font-bold text-brand">{value}</p>
                <div className="flex items-center justify-center gap-1 mt-1 text-center">
                  <Icon size={12} className={`text-slate-400 ${editable ? "group-hover:text-brand transition" : ""}`} />
                  <p className={`text-[10px] text-slate-400 uppercase ${editable ? "group-hover:text-brand" : ""}`}>{label}</p>
                </div>
              </>
            );

            // На чужом профиле карточки только отображаются — без ссылки и без ховера.
            if (!editable) {
              return (
                <div key={href} className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800">
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800 hover:border-brand transition group"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        <p className="text-[10px] text-slate-400 mb-4">
          В клубе с {new Date(user.created_at).toLocaleDateString()}
        </p>

        {editable && <Link href="/profile/edit">
          <button className="w-full flex items-center justify-center gap-2 bg-brand text-white dark:text-gray-900 py-3 rounded-xl font-bold shadow hover:bg-teal-600 transition hover:scale-[1.02] active:scale-[0.98]">
            <FaEdit className="text-lg" />
            Редактировать
          </button>
        </Link>}

        {editable && !user.is_premium && (
          <Link href="/premium" className="block mt-3">
            <button className="premium-lava-btn w-full h-10 rounded-xl font-black shadow-lg shadow-[#2EC4B6]/40 hover:scale-[1.03] active:scale-[0.97] transition-all">
              <div className="lava-container">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
              </div>
              <span className="flex items-center justify-center gap-2 text-white dark:text-gray-900 uppercase tracking-widest text-xs drop-shadow-md">
                <RiVipCrownFill className="text-lg" />
                КУПИТЬ PREMIUM
              </span>
            </button>
          </Link>
        )}

        {editable && onLogout && <button
          onClick={onLogout}
          className="w-full mt-3 text-red-400 text-sm font-bold hover:underline"
        >
          Выйти
        </button>}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { RiVipCrownFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { Heart, Star, MessageCircle, Users } from "lucide-react";

interface ProfileCardProps {
  user: {
    name: string;
    avatar: string | null;
    custom_status: string | null;
    bio?: string | null;
    created_at: string;
    is_premium?: boolean;
  };
  counts: {
    favorites: number;
    ratings: number;
    comments: number;
    friends: number;
  };
  onLogout: () => void;
}

export const ProfileCard = ({
  user,
  counts,
  onLogout,
}: ProfileCardProps) => {
  const getAvatarUrl = () => {
    if (!user.avatar) return null;

    const baseUrl = "http://164.90.185.95/storage/";
    const fullPath = user.avatar.startsWith("http")
      ? user.avatar
      : `${baseUrl}${user.avatar}`;

    return `${fullPath}${fullPath.includes("?") ? "&" : "?"}t=${Date.now()}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="bg-white dark:bg-[#161616] rounded-lg shadow-sm border border-slate-100 dark:border-gray-800 text-center sticky top-24 relative overflow-hidden">

      {user.is_premium && (
        <div className="absolute top-0 left-0 w-full h-[230px] bg-brand z-0" />
      )}

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
              className={`w-full h-full rounded-full object-cover border-4 dark:border-[#1d1d1d] shadow-lg ${user.is_premium
                ? "border-white"
                : "border-white dark:border-gray-800"
                }`}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-brand flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4! border-white! dark:border-black/80">
              {user.name ? user.name[0].toUpperCase() : "?"}
            </div>
          )}

          <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white dark:border-black/70 rounded-full z-10" />
        </div>

        <p className={`text-sm w-40 mx-auto font-bold mt-1 text-white dark:text-gray-900 italic ${user.is_premium ? "text-white" : "text-black"}`}>
          {user.custom_status || "Cтатус отсутствует"}
        </p>


        <p className={`text-xs mt-3 line-clamp-3 font-bold text-white dark:text-gray-900 px-2 ${user.is_premium ? "text-white" : "text-slate-400"
          }`}>
          {user.bio?.trim() ? user.bio : "Биография отсутствует"}
        </p>

        <div className="grid grid-cols-2 gap-2 my-6">
          <Link
            href="/bookmarks"
            className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800 hover:border-brand transition group"
          >
            <p className="font-bold text-brand">{counts.favorites}</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-center">
              <Heart size={12} className="text-slate-400 group-hover:text-brand transition" />
              <p className="text-[10px] text-slate-400 uppercase group-hover:text-brand">Избранное</p>
            </div>
          </Link>

          <Link
            href="/profile/ratings"
            className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800 hover:border-brand transition group"
          >
            <p className="font-bold text-brand">{counts.ratings}</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-center">
              <Star size={12} className="text-slate-400 group-hover:text-brand transition" />
              <p className="text-[10px] text-slate-400 uppercase group-hover:text-brand">Оценки</p>
            </div>
          </Link>

          <Link
            href="/profile/comments"
            className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800 hover:border-brand transition group"
          >
            <p className="font-bold text-brand">{counts.comments || 0}</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-center">
              <MessageCircle size={12} className="text-slate-400 group-hover:text-brand transition" />
              <p className="text-[10px] text-slate-400 uppercase group-hover:text-brand">Комменты</p>
            </div>
          </Link>

          <Link
            href="/profile/friends"
            className="bg-slate-100 dark:bg-[#161616] p-2 rounded-lg border border-slate-100 dark:border-gray-800 hover:border-brand transition group"
          >
            <p className="font-bold text-brand">{counts.friends || 0}</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-center">
              <Users size={12} className="text-slate-400 group-hover:text-brand transition" />
              <p className="text-[10px] text-slate-400 uppercase group-hover:text-brand">Друзья</p>
            </div>
          </Link>
        </div>

        <p className="text-[10px] text-slate-400 mb-4">
          В клубе с {new Date(user.created_at).toLocaleDateString()}
        </p>

        <Link href="/profile/edit">
          <button className="w-full flex items-center justify-center gap-2 bg-brand text-white dark:text-gray-900 py-3 rounded-xl font-bold shadow hover:bg-teal-600 transition">
            <FaEdit className="text-lg" />
            Редактировать
          </button>
        </Link>

        {!user.is_premium && (
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

        <button
          onClick={onLogout}
          className="w-full mt-3 text-red-400 text-sm font-bold hover:underline"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
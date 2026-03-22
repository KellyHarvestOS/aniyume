import React from 'react'
import Link from 'next/link'
import { FaGithub, FaTelegram } from 'react-icons/fa'
import { MdOutlineRocketLaunch } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full bg-linear-to-b from-white via-[#f7fefe] to-white dark:from-[#111111] dark:via-[#111111] dark:to-[#111111] text-gray-900 dark:text-gray-200 overflow-hidden flex flex-col items-center pt-32 pb-20 px-4 transition-colors">
      <style>{`
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-soft { animation: softFloat 6s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-[120px] left-0 w-full max-w-[1500px] mx-auto pointer-events-none hidden xl:block">
        <img
          src="/images/45.png"
          alt="Mascot Left"
          className="absolute left-0 top-24 h-[520px] object-contain animate-soft opacity-90 "
          style={{ transform: 'scaleX(-1)' }}
        />
        <img
          src="/images/35.png"
          alt="Mascot Right"
          className="absolute right-[-20] top-24 h-[520px] object-contain animate-soft opacity-90 "
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <div className="mb-10">
          <img
            src="/images/logo0.png"
            alt="Aniyume"
            className="w-[360px] md:w-[440px] h-auto object-contain animate-soft dark:hidden"
          />

          <img
            src="/images/logo01.png"
            alt="Aniyume"
            className="hidden w-[360px] md:w-[440px] h-auto object-contain animate-soft dark:block"
          />
        </div>

        <div className="text-center mb-20">
          <h1 className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-300 tracking-wide">
            Смотри аниме так, как удобно тебе
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
          <CleanCard
            icon={<MdOutlineRocketLaunch />}
            title="Скорость"
            desc="Next.js 14 обеспечивает мгновенную загрузку и плавную навигацию."
          />
          <CleanCard
            icon={<LuShieldCheck />}
            title="Комфорт"
            desc="Адаптивный плеер, чистый интерфейс и удобство на любом устройстве."
          />
          <CleanCard
            icon={<FaRegHeart />}
            title="Open Source"
            desc="Проект открыт для сообщества и развивается совместно."
          />
        </div>

        <div className="w-full py-10 border-t border-black/5 dark:border-gray-800 flex flex-wrap justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm font-mono tracking-tight">
          <span>NEXT.JS 14</span>
          <span>TYPESCRIPT</span>
          <span>TAILWIND</span>
          <span>KODIK API</span>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-10">
          <SocialBtn
            href="https://github.com/"
            icon={<FaGithub />}
            label="GitHub"
          />
          <SocialBtn
            href="https://t.me/aniYume_group"
            icon={<FaTelegram />}
            label="Telegram"
          />
        </div>
      </div>
    </div>
  )
}

function CleanCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-[#161616] border border-black/5 dark:border-gray-800 p-8 rounded-3xl hover:border-[#21D0B8]/40 transition-all duration-300 group shadow-xl hover:shadow-2xl">
      <div className="text-[#21D0B8] text-2xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-gray-900 dark:text-gray-200 font-semibold text-lg mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  )
}

function SocialBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-7 py-3 bg-white dark:bg-[#161616] border border-black/5 dark:border-gray-800 rounded-2xl hover:bg-[#21D0B8] hover:text-white transition-all duration-300 group shadow-md hover:shadow-lg"
    >
      <span className="text-xl text-[#21D0B8] group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="font-semibold text-xs uppercase tracking-widest">
        {label}
      </span>
    </Link>
  )
}

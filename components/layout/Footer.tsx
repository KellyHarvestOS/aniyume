'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FaTelegram,
  FaYoutube,
  FaDiscord,
  FaShieldAlt,
  FaBalanceScale,
  FaQuestionCircle,
} from 'react-icons/fa';
import { IoCall } from "react-icons/io5";
import { FaXTwitter } from 'react-icons/fa6';
import { HiAdjustmentsHorizontal, HiMiniBookmark, HiFire } from 'react-icons/hi2';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { getProfilePreference } from '@/lib/profilePreferences';

interface FooterLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [logoPaths, setLogoPaths] = useState({
    light: '/images/logo0.png',
    dark: '/images/logo01.png'
  });

  const applyTheme = useCallback(() => {
    const isPremium = localStorage.getItem("isPremium") === "true";
    const savedLogoKey = getProfilePreference("logo_key");

    if (isPremium && savedLogoKey) {
      setLogoPaths({
        light: `/images/LogoStyle/${savedLogoKey}Dark.png`,
        dark: `/images/LogoStyle/${savedLogoKey}White.png`
      });
    } else {
      setLogoPaths({
        light: '/images/logo01.png',
        dark: '/images/logo0.png'
      });
    }
  }, []);

  useEffect(() => {
    applyTheme();
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, [applyTheme]);

  return (
    <footer className="relative overflow-hidden bg-white pt-28 dark:bg-[#121212]">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 text-center lg:text-left">

          <div className="max-w-xl flex flex-col items-center lg:items-start grow">
            <Link href="/" className="inline-block transition-opacity">
              <Image
                src={logoPaths.dark}
                alt="AniYume"
                width={480}
                height={180}
                className="h-20 sm:h-30 w-auto dark:hidden object-contain"
                key={`footer-dark-${logoPaths.dark}`}
              />
              <Image
                src={logoPaths.light}
                alt="AniYume"
                width={480}
                height={180}
                className="hidden h-20 sm:h-30 w-auto dark:block object-contain"
                key={`footer-light-${logoPaths.light}`}
              />
            </Link>

            <p className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-gray-300">
              AniYume — современная платформа для просмотра аниме.
              Новинки, расписание, коллекции и живое сообщество в одном месте.
            </p>
          </div>

          <div className="relative w-[280px] sm:w-[420px] shrink-0">
            <Image
              src="/images/44.png"
              alt="AniYume mascot"
              width={900}
              height={400}
              className="w-full h-auto dark:hidden"
              priority
            />
            <Image
              src="/images/55.png"
              alt="AniYume mascot"
              width={900}
              height={400}
              className="hidden w-full h-auto dark:block"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-14 border-t border-slate-400 pt-20 px-10 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-700 dark:border-t">
          <Block title="Навигация">
            <FooterLink href="/popular" icon={HiFire}>Популярное</FooterLink>
            <FooterLink href="/schedule" icon={IoCalendarNumberSharp}>Расписание</FooterLink>
            <FooterLink href="/filter" icon={HiAdjustmentsHorizontal}>Фильтр</FooterLink>
            <FooterLink href="/bookmarks" icon={HiMiniBookmark}>Закладки</FooterLink>
          </Block>

          <Block title="Информация">
            <FooterLink href="/privacy" icon={FaShieldAlt}>Приватность</FooterLink>
            <FooterLink href="/terms" icon={FaBalanceScale}>Условия</FooterLink>
            <FooterLink href="/faq" icon={FaQuestionCircle}>FAQ</FooterLink>
            <FooterLink href="/contacts" icon={IoCall}>Контакты</FooterLink>
          </Block>

          <Block title="Поддержка">
            <p className="text-slate-600 dark:text-gray-400">Наша команда отвечает ежедневно</p>
            <a
              href="mailto:support@aniyume.com"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand px-6 py-4 font-semibold text-white transition hover:brightness-110 shadow-lg shadow-brand/20"
            >
              support@aniyume.com
            </a>
            <span className="mt-3 block text-sm text-slate-400 dark:text-gray-400">10:00 – 22:00</span>
          </Block>

          <Block title="Мы в соцсетях">
            <div className="grid grid-cols-4 gap-3 justify-items-center lg:justify-items-start">
              <SocialCard href="https://discord.gg/PYMXhXcR5Y" icon={FaDiscord} label="Discord" hoverClass="hover:bg-[#5865F2]! hover:text-white!" />
              <SocialCard href="https://t.me/aniYume_group" icon={FaTelegram} label="Telegram" hoverClass="hover:bg-[#2ca0de]! hover:text-white!" />
              <SocialCard href="https://www.youtube.com/" icon={FaYoutube} label="YouTube" hoverClass="hover:bg-[#FF0000]! hover:text-white!" />
              <SocialCard href="https://x.com/?lang=ru" icon={FaXTwitter} label="Twitter" hoverClass="hover:bg-black! hover:text-white!" />
            </div>
          </Block>
        </div>

        <div className="mt-20 border-t border-slate-300 py-10 text-center text-sm text-slate-400 dark:border-gray-700 dark:text-gray-400">
          © {year} AniYume. Все права защищены
        </div>
      </div>
    </footer>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-gray-200">
        <span className="border-b-4 border-brand-simple pb-1">{title}</span>
      </h3>
      <div className="flex flex-col items-center lg:items-start gap-4">{children}</div>
    </div>
  );
}

function FooterLink({ href, icon: Icon, children }: FooterLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 text-base transition-all duration-300 ${isActive
        ? 'translate-x-2'
        : 'text-slate-600 hover:translate-x-2 dark:text-gray-400'
        }`}
    >
      <Icon
        className={`text-xl transition-colors ${isActive
          ? 'icon-brand'
          : 'text-slate-400 group-hover:icon-brand'
          }`}
      />

      <span
        className={`inline-block ${isActive
          ? 'text-brand font-bold'
          : 'text-slate-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
          }`}
      >
        {children}
      </span>
    </Link>
  );
}

function SocialCard({ href, icon: Icon, label, hoverClass }: { href: string; icon: React.ElementType; label: string; hoverClass: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl bg-slate-100 text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md 
        dark:bg-gray-900 dark:text-gray-400 ${hoverClass}`}
    >
      <Icon className="text-2xl transition-transform duration-300 group-hover:scale-110" />
      <span className="text-[10px] font-semibold leading-none opacity-80 group-hover:opacity-100">{label}</span>
    </a>
  );
}

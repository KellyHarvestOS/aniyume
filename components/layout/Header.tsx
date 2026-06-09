'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaUserPlus, FaUserCircle } from 'react-icons/fa';
import { HiAdjustmentsHorizontal, HiMiniBookmark, HiFire } from "react-icons/hi2";
import { CgMenuRightAlt, CgMenuRight } from "react-icons/cg";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageAssetUrl } from '@/lib/storage';
import { getProfilePreference } from '@/lib/profilePreferences';

export default function Header() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [logoPaths, setLogoPaths] = useState({
    light: '/images/logo01.png',
    dark: '/images/logo0.png'
  });

  useEffect(() => {
    const applyTheme = () => {
      const isPremium = user?.is_premium || localStorage.getItem("isPremium") === "true";
      const themeType = getProfilePreference("theme_type");
      const themeValue = getProfilePreference("theme_value");
      const savedLogoKey = getProfilePreference("logo_key");

      if (isPremium) {
        document.documentElement.classList.add('is-premium');
        document.documentElement.classList.toggle('premium-cursor-disabled', getProfilePreference('premium_cursor_disabled') === 'true');

        if (savedLogoKey) {
          setLogoPaths({
            light: `/images/LogoStyle/${savedLogoKey}Dark.png`,
            dark: `/images/LogoStyle/${savedLogoKey}White.png`
          });
        }

        const savedCursor = getProfilePreference("cursor_path", "/images/cursor/Mouse-cursor.png");
        const savedCursorKey = getProfilePreference("cursor_key", "default");
        document.documentElement.dataset.premiumCursor = savedCursorKey || 'default';
        document.documentElement.style.setProperty('--premium-cursor', `url('${savedCursor}') 4 4`);
      } else {
        document.documentElement.classList.remove('is-premium');
        document.documentElement.classList.remove('premium-cursor-disabled');
        delete document.documentElement.dataset.premiumCursor;
        document.documentElement.style.removeProperty('--premium-cursor');

        setLogoPaths({ light: '/images/logo01.png', dark: '/images/logo0.png' });
      }

      if (isPremium && themeValue) {
        const root = document.documentElement;
        if (themeType === 'gradient') {
          const hexColors = themeValue.match(/#[a-fA-F0-9]{6}/g);
          if (hexColors && hexColors.length >= 2) {
            root.style.setProperty('--brand-gradient', `linear-gradient(90deg, ${hexColors[0]}, ${hexColors[1]})`);
            root.style.setProperty('--brand-main', hexColors[0]);
          }
        } else {
          root.style.setProperty('--brand-gradient', themeValue);
          root.style.setProperty('--brand-main', themeValue);
        }
      }
    };

    applyTheme();

    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const avatarUrl = getStorageAssetUrl(user?.avatar);
  const isLoggedIn = !!user;

  const isChatActive = pathname.startsWith('/profile/friends/chat');

  const navLinks = [
    { href: '/popular', label: 'Популярное', icon: <HiFire /> },
    { href: '/schedule', label: 'Расписание', icon: <IoCalendarNumberSharp /> },
    { href: '/filter', label: 'Фильтр', icon: <HiAdjustmentsHorizontal /> },
    { href: '/bookmarks', label: 'Закладки', icon: <HiMiniBookmark /> },
  ];

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 dark:border-[#232323] bg-white dark:bg-[#111111] text-foreground z-100 transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0 transition-opacity">
            <Image
              src={logoPaths.dark}
              alt="Aniyume Logo"
              width={160}
              height={50}
              className="h-10 md:h-14 w-auto object-contain dark:hidden"
              priority
              key={`dark-${logoPaths.dark}`}
            />
            <Image
              src={logoPaths.light}
              alt="Aniyume Logo"
              width={160}
              height={50}
              className="hidden h-10 md:h-14 w-auto object-contain dark:block"
              priority
              key={`light-${logoPaths.light}`}
            />
          </Link>
          <div >
            <ThemeToggle />
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 lg:flex max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group flex items-center gap-2 text-sm font-semibold transition-all ${isActive
                        ? 'translate-x-1'
                        : 'text-gray-500 dark:text-gray-400 hover:translate-x-1'
                        }`}
                    >
                      <span
                        className={`text-xl transition-transform group-hover:scale-110 ${isActive
                          ? 'scale-110 icon-brand'
                          : 'text-gray-400 group-hover:icon-brand'
                          }`}
                      >
                        {link.icon}
                      </span>

                      <span
                        className={`hidden xl:inline ${isActive
                          ? 'text-brand'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                          }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-6">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href={`/profile/friends/chat/${user?.id}`}
                  className="relative group transition-transform hover:scale-110 active:scale-95"
                  title="Сообщения"
                >
                  <HiOutlineChatBubbleOvalLeftEllipsis
                    size={26}
                    className={`transition-colors ${isChatActive ? 'text-brand' : 'text-gray-400 dark:text-gray-500 group-hover:text-brand'}`}
                  />

                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>

                <Link href="/profile" className="flex items-center transition-transform hover:scale-105">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className={`w-9 h-9 rounded-full object-cover border-2 shadow-sm ${pathname === '/profile' ? 'border-brand' : 'border-transparent'}`}
                      style={{ borderColor: pathname === '/profile' ? 'var(--brand-main)' : '' }}
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${pathname === '/profile' ? 'bg-brand' : 'bg-gray-400'}`}>
                      {user?.name ? user.name[0].toUpperCase() : <FaUserCircle size={32} />}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${pathname === '/login' ? 'text-brand' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <span>Вход</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-95"
                >
                  <FaUserPlus className="hidden sm:inline" />
                  <span>Регистрация</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <CgMenuRight size={28} /> : <CgMenuRightAlt size={28} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-[#232323] transition-all duration-300 transform lg:hidden ${isMenuOpen
          ? 'translate-y-0 opacity-100 visible'
          : '-translate-y-4 opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="p-4 space-y-6">
          <div className="block lg:hidden">
            <SearchBar />
          </div>

          <nav>
            <ul className="grid grid-cols-2 gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border transition-all ${isActive ? 'border-brand' : 'border-transparent'
                        } hover:border-brand`}
                    >
                      <span className={`text-2xl ${isActive ? 'icon-brand' : 'icon-brand'}`}>{link.icon}</span>
                      <span className={`text-sm font-bold ${isActive ? 'text-brand' : 'dark:text-gray-200'}`}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {!isLoggedIn && (
            <div className="flex flex-col gap-3 pb-4">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 text-center font-bold rounded-2xl bg-gray-100 dark:bg-white/10"
              >
                Вход в аккаунт
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

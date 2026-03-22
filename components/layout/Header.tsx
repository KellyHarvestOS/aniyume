'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaUserPlus, FaUserCircle } from 'react-icons/fa';
import { HiAdjustmentsHorizontal, HiMiniBookmark } from "react-icons/hi2";
import { CgMenuRightAlt, CgMenuRight } from "react-icons/cg";

import { IoCalendarNumberSharp } from "react-icons/io5";
import { FaRankingStar } from "react-icons/fa6";
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchUser = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    setIsLoggedIn(true);
    try {
      const res = await fetch('/api/external/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
      }
    } catch { }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('authChange', fetchUser);
    window.addEventListener('storage', fetchUser);
    return () => {
      window.removeEventListener('authChange', fetchUser);
      window.removeEventListener('storage', fetchUser);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    const baseUrl = "http://164.90.185.95/storage/";
    const fullPath = user.avatar.startsWith('http') ? user.avatar : `${baseUrl}${user.avatar}`;
    return `${fullPath}?t=${Date.now()}`;
  };

  const avatarUrl = getAvatarUrl();

  const navLinks = [
    { href: '/popular', label: 'Популярное', icon: <FaRankingStar /> },
    { href: '/schedule', label: 'Расписание', icon: <IoCalendarNumberSharp /> },
    { href: '/filter', label: 'Фильтр', icon: <HiAdjustmentsHorizontal /> },
    { href: '/bookmarks', label: 'Закладки', icon: <HiMiniBookmark /> },
  ];

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 dark:border-[#232323] bg-white dark:bg-[#111111] text-foreground z-100 transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/images/logo0.png"
              alt="Aniyume Logo"
              width={160}
              height={50}
              className="h-10 md:h-14 w-auto object-contain dark:hidden"
              priority
            />
            <Image
              src="/images/logo01.png"
              alt="Aniyume Logo"
              width={160}
              height={50}
              className="hidden h-10 md:h-14 w-auto object-contain dark:block"
              priority
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
                      className={`group flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#39bcba] ${isActive ? 'text-[#39bcba]' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                        {link.icon}
                      </span>
                      <span className="hidden xl:inline">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-6">
            {isLoggedIn ? (
              <Link href="/profile" className="flex items-center transition-transform hover:scale-105">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className={`w-9 h-9 rounded-full object-cover border-2 shadow-sm ${pathname === '/profile' ? 'border-[#39bcba]' : 'border-transparent'}`}
                    style={{ borderColor: pathname === '/profile' ? '#39bcba' : '' }}
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${pathname === '/profile' ? 'bg-[#39bcba]' : 'bg-gray-400'}`}>
                    {user?.name ? user.name[0].toUpperCase() : <FaUserCircle size={32} />}
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${pathname === '/login' ? 'text-[#39bcba]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <span>Вход</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-[#39bcba] px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-[#39bcba]/20 hover:bg-[#2f9795] transition-all active:scale-95"
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
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border transition-all ${isActive ? 'border-[#39bcba]' : 'border-transparent'
                        } hover:border-[#39bcba]`}
                    >
                      <span className={`text-2xl ${isActive ? 'text-[#39bcba]' : 'text-[#39bcba]'}`}>{link.icon}</span>
                      <span className={`text-sm font-bold ${isActive ? 'text-[#39bcba]' : 'dark:text-gray-200'}`}>
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
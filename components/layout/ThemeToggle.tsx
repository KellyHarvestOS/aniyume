'use client';

import { useEffect, useState } from 'react';
import { HiSun } from 'react-icons/hi';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 border-2 border-gray-900 rounded-full" />;
  }

  const isDark = resolvedTheme === 'dark';

  const handleChange = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <label
      className={`border-2 border-gray-900 mt-3 dark:border-gray-300 w-10 h-10 rounded-full grid place-items-center cursor-pointer transition-colors duration-300 ${isDark ? 'bg-[#232323]' : 'bg-white'
        }`}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={isDark}
        onChange={handleChange}
      />

      <div
        className={`col-start-1 row-start-1 transition-transform duration-500 ${isDark ? 'delay-0 rotate-360 scale-0' : 'delay-200 scale-100'
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="25"
          height="25"
          className={isDark ? 'text-gray-200' : 'text-gray-800'}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
          ></path>
        </svg>
      </div>

      <div
        className={`col-start-1 row-start-1 transition-transform duration-500 ${isDark ? 'delay-200 scale-100 rotate-360' : 'scale-0'
          }`}
      >
        <HiSun size={28} className="text-gray-200" />
      </div>
    </label>
  );
}
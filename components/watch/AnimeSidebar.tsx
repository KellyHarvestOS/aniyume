// components/AnimeSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { AnimeDetails } from '@/types/anime';
import { useI18n } from '@/contexts/I18nContext';

interface AnimeSidebarProps {
  recommendations: AnimeDetails[];
}

export default function AnimeSidebar({ recommendations }: AnimeSidebarProps) {
  const { t } = useI18n();
  return (
    <div className="hidden lg:block">
      <div className="bg-gray-100 dark:bg-[#111111] p-5 rounded-xl border border-gray-300 dark:border-gray-800 sticky top-4 transition-colors">
        <h3 className="text-lg font-bold text-black dark:text-gray-200 mb-4">
          {t('sidebar.similarTop')}
        </h3>

        <div className="space-y-4">
          {recommendations.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.loading')}
            </p>
          )}

          {recommendations.map((item) => (
            <Link
              href={`/anime/${item.id}`}
              key={item.id}
              className="flex gap-3 p-2 rounded-lg transition cursor-pointer group hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
            >
              <div className="w-16 h-24 bg-gray-300 dark:bg-[#1a1a1a] rounded overflow-hidden shrink-0 border border-transparent dark:border-gray-800">
                <img
                  src={item.poster_url || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-brand transition line-clamp-2 leading-tight">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.year} • {item.type}
                </p>

                <div className="flex items-center text-xs text-amber-500 mt-1">
                  <FaStar className="mr-1" /> {item.rating}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

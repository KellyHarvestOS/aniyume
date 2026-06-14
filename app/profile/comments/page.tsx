'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import MyCommentsSkeleton from '@/components/skeletons/MyCommentsSkeleton';
import { useI18n } from '@/contexts/I18nContext';
import {
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

interface UserComment {
  id: number;
  comment: string;
  created_at: string;
  anime?: {
    id: number;
    title: string;
    slug: string;
    poster_url?: string;
  };
}

const CommentCard = ({ c, onDelete, getPosterUrl }: { c: UserComment, onDelete: (id: number) => void, getPosterUrl: (p?: string) => string }) => {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 150) {
      setIsLong(true);
    }
  }, [c.comment]);

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161616] overflow-hidden hover:border-[#39bcba]/30 transition-all duration-500 shadow-sm">
      <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/10">
        {c.anime && (
          <Link href={`/anime/${c.anime.id}`} className="shrink-0">
            <div className="w-14 sm:w-16 h-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
              <img
                src={getPosterUrl(c.anime.poster_url)}
                alt={c.anime.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/anime/${c.anime?.id}`}
              className="text-sm sm:text-base font-black hover:text-[#39bcba] transition-colors line-clamp-2 uppercase tracking-tight leading-tight"
            >
              {c.anime?.title || t('myComments.noTitle')}
            </Link>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onDelete(c.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
            <FaCalendarAlt className="text-[#39bcba]" />
            {new Date(c.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="relative p-4 sm:p-5">
        <div
          ref={contentRef}
          className={`prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-gray-300 overflow-hidden transition-all duration-500 ${!isExpanded && isLong ? 'max-h-[120px]' : 'max-h-[1000px]'}`}
          dangerouslySetInnerHTML={{ __html: c.comment || '' }}
        />

        {!isExpanded && isLong && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-slate-50 dark:from-[#161616] to-transparent" />
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-tighter text-[#39bcba] hover:bg-[#39bcba]/5 transition-colors border-t border-slate-200 dark:border-white/5"
        >
          {isExpanded ? <><FaChevronUp /> {t('myComments.collapse')}</> : <><FaChevronDown /> {t('myComments.readMore')}</>}
        </button>
      )}
    </article>
  );
};

export default function MyCommentsPage() {
  const { t } = useI18n();
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);

  const getPosterUrl = (path: string | undefined) => {
    if (!path) return '/no-poster.png';
    if (path.startsWith('http')) return path;
    return `/api-storage/${path}`;
  };

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/external/my-comments', {
          headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json;
          setComments(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t('myComments.confirmDelete'))) return;
    const token = localStorage.getItem('userToken');
    try {
      const res = await fetch(`/api/external/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setComments((p) => p.filter((c) => c.id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) return <MyCommentsSkeleton />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] text-slate-900 dark:text-gray-100 pb-24 transition-colors overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-5 mb-8 sm:mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 border-b border-gray-100 dark:border-white/5 pb-6 sm:pb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none break-words">
              {t('myComments.title1')} <span className="text-brand block sm:inline">{t('myComments.title2')}</span>
            </h1>
            <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[9px] sm:text-[10px] ml-1">
              {t('myComments.totalMessages', { n: comments.length })}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center py-20 sm:py-40 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 sm:mb-8">
              <FaSearch className="text-2xl sm:text-3xl text-slate-300 dark:text-gray-700" />
            </div>
            <h2 className="text-lg sm:text-xl font-black mb-6 uppercase tracking-tight">{t('myComments.empty')}</h2>
            <Link href="/catalog" className="px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-brand text-white font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand/20">
              {t('myComments.toCatalog')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {comments.map((c) => (
              <CommentCard
                key={c.id}
                c={c}
                onDelete={handleDelete}
                getPosterUrl={getPosterUrl}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

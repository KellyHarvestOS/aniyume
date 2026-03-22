'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import MyCommentsSkeleton from '@/components/skeletons/MyCommentsSkeleton';
import {
  FaTrash,
  FaRegCommentDots,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 150) {
      setIsLong(true);
    }
  }, [c.comment]);

  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161616] overflow-hidden hover:border-[#39bcba]/30 transition-all duration-500 shadow-sm">
      <div className="p-5 flex gap-4 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/10">
        {c.anime && (
          <Link href={`/anime/${c.anime.id}`} className="shrink-0">
            <div className="w-16 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
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
              className="text-base font-black hover:text-[#39bcba] transition-colors line-clamp-2 uppercase tracking-tight leading-tight"
            >
              {c.anime?.title || 'Без названия'}
            </Link>
            <div className="flex gap-1">
              <button
                onClick={() => onDelete(c.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
            <FaCalendarAlt className="text-[#39bcba]" />
            {new Date(c.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="relative p-5">
        <div
          ref={contentRef}
          className={`prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-gray-300 overflow-hidden transition-all duration-500 ${!isExpanded && isLong ? 'max-h-[120px]' : 'max-h-[1000px]'}`}
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
          {isExpanded ? <><FaChevronUp /> Свернуть</> : <><FaChevronDown /> Читать полностью</>}
        </button>
      )}
    </article>
  );
};

export default function MyCommentsPage() {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);

  const getPosterUrl = (path: string | undefined) => {
    if (!path) return '/no-poster.png';
    if (path.startsWith('http')) return path;
    return `http://164.90.185.95/storage/${path}`;
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
    if (!confirm('Удалить этот комментарий?')) return;
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
    <div className="min-h-screen bg-white dark:bg-[#111111] text-slate-900 dark:text-gray-100 pb-24 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-5 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-10">

          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
              Мои <span className="text-[#39bcba]">Комментарии</span>
            </h1>
            <p className="mt-3 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px] ml-1">
              Всего • Сообщений • {comments.length}
            </p>
          </div>

        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center py-40 text-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center mb-8">
              <FaSearch className="text-3xl text-slate-300 dark:text-gray-700" />
            </div>
            <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Список пуст</h2>
            <Link href="/catalog" className="px-10 py-4 rounded-xl bg-[#39bcba] text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#39bcba]/20">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
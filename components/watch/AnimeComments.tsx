"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBold, FaItalic, FaSyncAlt, FaSmile, FaTrash, FaEdit, FaSave, FaTimes, FaLock, FaReply, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa';
import Modal from '@/components/modals/ErrorModal';
import ReportButton from '@/components/reports/ReportButton';
import { getStorageAssetUrl } from '@/lib/storage';

const EMOJIS = ['😊', '😂', '😍', '🤔', '😎', '😭', '😮', '🔥', '✨', '👍', '👎', '❤️', '😱', '🙌', '👀'];


const BAD_WORDS = ["нах", "хуй", "пизд", "ебат", "ебал", "бля", "сук", "хуе", "пидо", "гандон", "ублюд", "курва", "шалав", "ебан", "мудил", "дроч", "залуп", "пидр", "трах", "член", "ссан", "гавно", "гавно", "говно", "пор", "конч", "залу"];

const applyCensorship = (text: string) => {
  if (!text) return "";
  let censored = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`(${word}[а-яё]*)`, 'gi');
    censored = censored.replace(regex, (match) => {
      if (match.length <= 2) return match;
      return match.substring(0, 2) + "*".repeat(match.length - 2);
    });
  });
  return censored;
};

const PREVIEW_COMMENTS = [
  {
    id: 9001,
    comment: 'Очень атмосферная первая серия. Хочется посмотреть, как будет развиваться мир.',
    created_at: new Date().toISOString(),
    likes_count: 12,
    dislikes_count: 1,
    admin_hearted: true,
    user: { name: 'YumeFan', avatar: null },
    replies: [
      {
        id: 9101,
        comment: 'Согласен, визуал прямо цепляет.',
        created_at: new Date().toISOString(),
        likes_count: 4,
        dislikes_count: 0,
        user: { name: 'AniViewer', avatar: null },
      },
    ],
  },
  {
    id: 9002,
    comment: 'Плеер и карточка выглядят аккуратно, но хочется больше деталей в описании.',
    created_at: new Date().toISOString(),
    likes_count: 5,
    dislikes_count: 0,
    admin_hearted: false,
    user: { name: 'PreviewUser', avatar: null },
    replies: [],
  },
];

export default function AnimeComments({ animeId, preview = false }: { animeId: string | number; preview?: boolean }) {
  const [comments, setComments] = useState<any[]>(preview ? PREVIEW_COMMENTS : []);
  const [user, setUser] = useState<any>({ name: null, avatar: null, ok: false, loading: true });
  const [cp, setCp] = useState({ input: '', text: '', t: 0, can: true });
  const [ui, setUi] = useState({ emo: false, len: 0, sub: false, m: false, del: null as any, edit: null as any, reply: null as any, replyText: '' });

  const edRef = useRef<HTMLDivElement>(null);
  const upRef = useRef<HTMLDivElement>(null);

  const call = async (url: string, method = "GET", body?: any) => {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("userToken")}` },
      body: body ? JSON.stringify(body) : null
    });
    return res.ok ? res.json() : Promise.reject();
  };

  const getImg = (p: string) => getStorageAssetUrl(p);

  useEffect(() => {
    setUi(p => ({ ...p, m: true }));
    genCp();
    if (preview) {
      setUser({ name: 'AdminPreview', avatar: null, ok: true, loading: false, is_admin: true });
      setComments(PREVIEW_COMMENTS);
      return;
    }
    call("/api/external/profile/me").then(j => setUser({ ...(j.user || j), ok: true, loading: false })).catch(() => setUser((u: any) => ({ ...u, loading: false })));
    if (animeId) call(`/api/external/public/anime/${animeId}/comments`).then(j => setComments(j.data || []));
  }, [animeId, preview]);

  useEffect(() => {
    if (cp.t > 0) {
      const i = setInterval(() => setCp(c => ({ ...c, t: c.t - 1 })), 1000);
      return () => clearInterval(i);
    } else setCp(c => ({ ...c, can: true }));
  }, [cp.t]);

  const genCp = () => setCp(c => ({ ...c, text: Math.random().toString(36).slice(2, 6), can: false, t: 30 }));

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    edRef.current?.focus();
    setUi(p => ({ ...p, len: edRef.current?.innerText.length || 0 }));
  };

  const send = async () => {
    let html = edRef.current?.innerHTML.replace(/&nbsp;/g, ' ') || "";
    html = applyCensorship(html);

    const txt = edRef.current?.innerText.trim() || "";
    if (txt.length < 3) return alert('Минимум 3 символа');
    if (cp.input !== cp.text) return (alert('Капча!'), genCp());

    setUi(p => ({ ...p, sub: true }));
    const payload = { anime_id: +animeId, comment: html };
    if (preview) {
      setComments([{ id: Date.now(), comment: html, created_at: new Date().toISOString(), likes_count: 0, dislikes_count: 0, admin_hearted: false, user, replies: [] }, ...comments]);
      if (edRef.current) edRef.current.innerHTML = '';
      setCp(c => ({ ...c, input: '' }));
      setUi(p => ({ ...p, len: 0, sub: false }));
      genCp();
      return;
    }

    call("/api/external/comments", "POST", payload)
      .then(j => {
        setComments([j.data, ...comments]);
        if (edRef.current) edRef.current.innerHTML = '';
        setCp(c => ({ ...c, input: '' }));
        setUi(p => ({ ...p, len: 0 }));
        genCp();
      })
      .finally(() => setUi(p => ({ ...p, sub: false })));
  };

  const updateComment = (commentId: number, updater: (comment: any) => any) => {
    setComments(prev => prev.map(comment => comment.id === commentId ? updater(comment) : comment));
  };

  const reactToComment = (commentId: number, type: 'like' | 'dislike') => {
    updateComment(commentId, comment => {
      const current = comment.viewer_reaction;
      const next = current === type ? null : type;
      return {
        ...comment,
        viewer_reaction: next,
        likes_count: Math.max(0, Number(comment.likes_count || 0) + (current === 'like' ? -1 : 0) + (next === 'like' ? 1 : 0)),
        dislikes_count: Math.max(0, Number(comment.dislikes_count || 0) + (current === 'dislike' ? -1 : 0) + (next === 'dislike' ? 1 : 0)),
      };
    });
    if (!preview) call(`/api/external/comments/${commentId}/reactions`, 'POST', { type }).catch(() => {});
  };

  const toggleAdminHeart = (commentId: number) => {
    updateComment(commentId, comment => ({ ...comment, admin_hearted: !comment.admin_hearted }));
    if (!preview) call(`/api/external/comments/${commentId}/admin-heart`, 'POST').catch(() => {});
  };

  const sendReply = (commentId: number) => {
    const text = applyCensorship(ui.replyText.trim());
    if (text.length < 2) return;
    const reply = { id: Date.now(), comment: text, created_at: new Date().toISOString(), likes_count: 0, dislikes_count: 0, user };
    updateComment(commentId, comment => ({ ...comment, replies: [...(comment.replies || []), reply] }));
    setUi(p => ({ ...p, reply: null, replyText: '' }));
    if (!preview) call(`/api/external/comments/${commentId}/replies`, 'POST', { comment: text }).catch(() => {});
  };

  if (!ui.m) return null;
  if (user.loading) return <div className="brand-text py-10 text-center animate-pulse font-bold">Загрузка...</div>;

  return (
    <div className="min-w-0 lg:col-span-2">
      <h2 className="brand-border text-xl font-black mb-6 border-l-4 pl-3 uppercase">Отзывы</h2>
      {user.ok ? (
        <div className="bg-gray-50 border-gray-300 dark:bg-[#161616] p-4 sm:p-6 rounded-lg border dark:border-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={user.name} src={getImg(user.avatar as any)} size="10" />
            <p className="font-black dark:text-gray-200">{user.name}</p>
          </div>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#111111]">
            <div className="flex p-2 gap-1 border-gray-300 bg-gray-50/60 dark:bg-[#1a1a1a] border-b dark:border-gray-800">
              <Btn icon={<FaBold size={12} />} onClick={() => exec('bold')} />
              <Btn icon={<FaItalic size={12} />} onClick={() => exec('italic')} />
              <div className="relative">
                <Btn icon={<FaSmile size={14} />} onClick={() => setUi(p => ({ ...p, emo: !p.emo }))} active={ui.emo} />
                {ui.emo && <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-[#111111] border dark:border-gray-700 rounded-lg shadow-xl z-50 grid grid-cols-5 w-44">
                  {EMOJIS.map(e => <button key={e} onClick={() => { exec('insertText', e); setUi(p => ({ ...p, emo: false })); }} className="hover:scale-110 p-1">{e}</button>)}
                </div>}
              </div>
            </div>
            <div ref={edRef} contentEditable onInput={() => setUi(p => ({ ...p, len: edRef.current?.innerText.length || 0 }))} className="p-4 h-32 overflow-y-auto outline-none text-sm dark:text-gray-200 wrap-break-word" />
          </div>
          <div className="text-right text-[10px] font-bold text-gray-400 my-2 uppercase">{ui.len} / 1000</div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input className="grow p-3 rounded-lg border-gray-400 dark:bg-[#111111] border dark:border-gray-700 text-sm outline-none" placeholder="Код" value={cp.input} onChange={e => setCp(c => ({ ...c, input: e.target.value }))} />
            <div className="flex items-center gap-3">
              <div
                className="bg-gray-200 border-gray-600 dark:bg-[#1a1a1a] px-6 py-2 rounded-lg font-black tracking-widest italic text-xl border dark:border-gray-700 select-none cursor-default"
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                {cp.text}
              </div>
              <button onClick={genCp} disabled={!cp.can} className={!cp.can ? 'text-gray-600' : 'brand-text'}><FaSyncAlt /></button>
              {!cp.can && <span className="text-[9px] font-bold text-gray-400 uppercase">через {cp.t}с</span>}
            </div>
          </div>
          <button onClick={send} disabled={ui.sub} className="bg-brand w-full text-white font-black py-4 rounded-lg uppercase text-xs tracking-widest disabled:opacity-50">{ui.sub ? '...' : 'Отправить'}</button>
        </div>
      ) : <Prompt />}

      <div className="mt-12 space-y-6">
        {comments.map(c => (
          <div key={c.id} className="flex min-w-0 gap-3 sm:gap-4 p-3 sm:p-5 bg-white dark:bg-[#181818] rounded-lg border border-gray-300 sm:border-gray-400 dark:border-gray-800">
            <Avatar name={c.user.name} src={getImg(c.user.avatar)} size="12" />
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-black dark:text-gray-200"><span className="truncate">{c.user.name}</span> <span className="text-[10px] text-gray-400 uppercase">{new Date(c.created_at).toLocaleDateString()}</span></div>
                <div className="flex shrink-0 gap-2 text-gray-400 items-center self-end sm:self-auto">
                  {user.ok && user.name !== c.user.name ? <ReportButton targetType="comment" targetId={Number(c.id)} compact /> : null}
                  {user.ok && user.name === c.user.name && <><button onClick={() => setUi(p => ({ ...p, edit: ui.edit === c.id ? null : c.id }))} className='hover:brand-text'>{ui.edit === c.id ? <FaTimes /> : <FaEdit />}</button><button onClick={() => setUi(p => ({ ...p, del: c.id }))} className="hover:text-red-500"><FaTrash /></button></>}
                </div>
              </div>
              {ui.edit === c.id ? (
                <div>
                  <div ref={upRef} contentEditable dangerouslySetInnerHTML={{ __html: c.comment }} className="p-3 border dark:border-gray-700 rounded bg-gray-50 dark:bg-[#111111] outline-none text-sm mb-2 wrap-break-word" />
                  <button onClick={() => {
                    let cleanedHtml = upRef.current?.innerHTML.replace(/&nbsp;/g, ' ') || "";
                    cleanedHtml = applyCensorship(cleanedHtml);
                    call(`/api/external/comments/${c.id}`, "PATCH", { comment: cleanedHtml }).then(j => { setComments(prev => prev.map(x => x.id === c.id ? j.data : x)); setUi(p => ({ ...p, edit: null })); })
                  }} className="brand-bg text-white px-4 py-1.5 rounded text-[10px] font-black uppercase flex items-center gap-2"><FaSave /> Ок</button>
                </div>
              ) : (
                <div className="text-sm dark:text-gray-400 prose dark:prose-invert wrap-break-word max-w-full" dangerouslySetInnerHTML={{ __html: applyCensorship(c.comment) }} />
              )}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 text-xs text-gray-400">
                <ActionButton title="Ответить" active={ui.reply === c.id} onClick={() => setUi(p => ({ ...p, reply: p.reply === c.id ? null : c.id, replyText: '' }))} icon={<FaReply />} />
                <ActionButton title="Лайк" active={c.viewer_reaction === 'like'} onClick={() => reactToComment(c.id, 'like')} icon={<FaThumbsUp />} count={c.likes_count || 0} />
                <ActionButton title="Дизлайк" active={c.viewer_reaction === 'dislike'} onClick={() => reactToComment(c.id, 'dislike')} icon={<FaThumbsDown />} count={c.dislikes_count || 0} />
                {(user.is_admin || user.role === 'admin') && <ActionButton title="Сердце админа" active={!!c.admin_hearted} onClick={() => toggleAdminHeart(c.id)} icon={<FaHeart />} />}
              </div>
              {ui.reply === c.id && (
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-[#111111]">
                  <textarea value={ui.replyText} onChange={e => setUi(p => ({ ...p, replyText: e.target.value }))} placeholder={`Ответить ${c.user.name}...`} className="brand-focus h-20 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none dark:border-gray-700 dark:bg-[#181818] dark:text-gray-200" />
                  <div className="mt-2 flex justify-end gap-2">
                    <button onClick={() => setUi(p => ({ ...p, reply: null, replyText: '' }))} className="rounded-lg px-3 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Отмена</button>
                    <button onClick={() => sendReply(c.id)} className="bg-brand rounded-lg px-4 py-2 text-[10px] font-black uppercase text-white">Ответить</button>
                  </div>
                </div>
              )}
              {Array.isArray(c.replies) && c.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l-2 pl-3 sm:pl-4 brand-border">
                  {c.replies.map((reply: any) => (
                    <div key={reply.id} className="flex gap-3 rounded-xl bg-gray-50 p-3 dark:bg-[#111111]">
                      <Avatar name={reply.user.name} src={getImg(reply.user.avatar)} size="8" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2 text-xs font-black dark:text-gray-200">
                          {reply.user.name}
                          <span className="text-[9px] font-bold uppercase text-gray-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: applyCensorship(reply.comment) }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!ui.del} onClose={() => setUi(p => ({ ...p, del: null }))} onConfirm={() => call(`/api/external/comments/${ui.del}`, "DELETE").then(() => { setComments(p => p.filter(x => x.id !== ui.del)); setUi(p => ({ ...p, del: null })); })} title="Удалить?" message="Это действие необратимо." />
    </div>
  );
}

const Btn = ({ icon, onClick, active }: any) => (
  <button onClick={onClick} className={`p-2 rounded transition ${active ? 'text-brand bg-white dark:bg-gray-800' : 'text-gray-500 hover:bg-white dark:hover:bg-gray-800'}`}>{icon}</button>
);

const ActionButton = ({ icon, onClick, active, count, title }: any) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] sm:gap-1.5 sm:px-2.5 sm:text-[11px] font-black transition ${active ? 'brand-border bg-brand/10 text-brand' : 'border-gray-200 bg-gray-50 text-gray-400 hover:brand-border hover:brand-text dark:border-gray-800 dark:bg-[#111111]'}`}
  >
    {icon}
    {typeof count === 'number' && <span>{count}</span>}
  </button>
);

const Avatar = ({ name, src, size }: any) => {
  const sizeClass = size === '8' ? 'h-8 w-8 text-xs' : size === '10' ? 'h-10 w-10 text-sm' : 'h-10 w-10 sm:h-12 sm:w-12 text-sm';
  return src ? <img src={src} className={`${sizeClass} shrink-0 rounded-full object-cover border-2 border-brand`} alt="" />
    : <div className={`${sizeClass} brand-bg shrink-0 rounded-full flex items-center justify-center text-white font-bold`}>{name?.[0]?.toUpperCase()}</div>;
};

const Prompt = () => (
  <div className="bg-gray-50 dark:bg-[#0b0f1a] p-10 rounded-lg border-2 border-dashed dark:border-gray-800 text-center">
    <FaLock className="mx-auto mb-4 text-gray-300" size={24} />
    <Link href="/login" className="brand-bg text-white px-10 py-3 rounded-lg font-black text-xs uppercase inline-block">Войти</Link>
  </div>
);

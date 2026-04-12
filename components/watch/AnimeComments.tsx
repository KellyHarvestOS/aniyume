"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBold, FaItalic, FaSyncAlt, FaSmile, FaTrash, FaEdit, FaSave, FaTimes, FaLock } from 'react-icons/fa';
import Modal from '@/components/modals/ErrorModal';

const EMOJIS = ['😊', '😂', '😍', '🤔', '😎', '😭', '😮', '🔥', '✨', '👍', '👎', '❤️', '😱', '🙌', '👀'];
const API = "/api-storage/";


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

export default function AnimeComments({ animeId }: { animeId: string | number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState({ name: null, avatar: null, ok: false, loading: true });
  const [cp, setCp] = useState({ input: '', text: '', t: 0, can: true });
  const [ui, setUi] = useState({ emo: false, len: 0, sub: false, m: false, del: null as any, edit: null as any });

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

  const getImg = (p: string) => p?.startsWith('http') ? p : p ? `${API}${p}` : null;

  useEffect(() => {
    setUi(p => ({ ...p, m: true }));
    genCp();
    call("/api/external/profile/me").then(j => setUser({ ...j.user, ok: true, loading: false })).catch(() => setUser(u => ({ ...u, loading: false })));
    if (animeId) call(`/api/external/public/anime/${animeId}/comments`).then(j => setComments(j.data || []));
  }, [animeId]);

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
    call("/api/external/comments", "POST", { anime_id: +animeId, comment: html })
      .then(j => {
        setComments([j.data, ...comments]);
        if (edRef.current) edRef.current.innerHTML = '';
        setCp(c => ({ ...c, input: '' }));
        setUi(p => ({ ...p, len: 0 }));
        genCp();
      })
      .finally(() => setUi(p => ({ ...p, sub: false })));
  };

  if (!ui.m) return null;
  if (user.loading) return <div className="py-10 text-center text-[#39bcba] animate-pulse font-bold">Загрузка...</div>;

  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-black mb-6 border-l-4 border-[#39bcba] pl-3 uppercase">Отзывы</h2>
      {user.ok ? (
        <div className="bg-gray-50 border-gray-300 dark:bg-[#161616] p-6 rounded-lg border dark:border-gray-800">
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
              <button onClick={genCp} disabled={!cp.can} className={!cp.can ? 'text-gray-600' : 'text-[#39bcba]'}><FaSyncAlt /></button>
              {!cp.can && <span className="text-[9px] font-bold text-gray-400 uppercase">через {cp.t}с</span>}
            </div>
          </div>
          <button onClick={send} disabled={ui.sub} className="w-full bg-[#39bcba] text-white font-black py-4 rounded-lg uppercase text-xs tracking-widest disabled:opacity-50">{ui.sub ? '...' : 'Отправить'}</button>
        </div>
      ) : <Prompt />}

      <div className="mt-12 space-y-6">
        {comments.map(c => (
          <div key={c.id} className="flex gap-4 p-5 bg-white dark:bg-[#181818] rounded-lg border border-gray-400 dark:border-gray-800">
            <Avatar name={c.user.name} src={getImg(c.user.avatar)} size="12" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-black dark:text-gray-200">{c.user.name} <span className="text-[10px] text-gray-400 uppercase">{new Date(c.created_at).toLocaleDateString()}</span></div>
                {user.ok && user.name === c.user.name && (
                  <div className="flex gap-2 text-gray-400">
                    <button onClick={() => setUi(p => ({ ...p, edit: ui.edit === c.id ? null : c.id }))} className='hover:text-teal-400'>{ui.edit === c.id ? <FaTimes /> : <FaEdit />}</button>
                    <button onClick={() => setUi(p => ({ ...p, del: c.id }))} className="hover:text-red-500"><FaTrash /></button>
                  </div>
                )}
              </div>
              {ui.edit === c.id ? (
                <div>
                  <div ref={upRef} contentEditable dangerouslySetInnerHTML={{ __html: c.comment }} className="p-3 border dark:border-gray-700 rounded bg-gray-50 dark:bg-[#111111] outline-none text-sm mb-2 wrap-break-word" />
                  <button onClick={() => {
                    let cleanedHtml = upRef.current?.innerHTML.replace(/&nbsp;/g, ' ') || "";
                    cleanedHtml = applyCensorship(cleanedHtml);
                    call(`/api/external/comments/${c.id}`, "PATCH", { comment: cleanedHtml }).then(j => { setComments(prev => prev.map(x => x.id === c.id ? j.data : x)); setUi(p => ({ ...p, edit: null })); })
                  }} className="bg-[#39bcba] text-white px-4 py-1.5 rounded text-[10px] font-black uppercase flex items-center gap-2"><FaSave /> Ок</button>
                </div>
              ) : (
                <div className="text-sm dark:text-gray-400 prose dark:prose-invert wrap-break-word max-w-full" dangerouslySetInnerHTML={{ __html: applyCensorship(c.comment) }} />
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
  <button onClick={onClick} className={`p-2 rounded transition ${active ? 'text-[#39bcba] bg-white dark:bg-gray-800' : 'text-gray-500 hover:bg-white dark:hover:bg-gray-800'}`}>{icon}</button>
);

const Avatar = ({ name, src, size }: any) => (
  src ? <img src={src} className={`w-${size} h-${size} rounded-full object-cover border-2 border-[#39bcba]`} alt="" />
    : <div className={`w-${size} h-${size} rounded-full bg-[#39bcba] flex items-center justify-center text-white font-bold`}>{name?.[0].toUpperCase()}</div>
);

const Prompt = () => (
  <div className="bg-gray-50 dark:bg-[#0b0f1a] p-10 rounded-lg border-2 border-dashed dark:border-gray-800 text-center">
    <FaLock className="mx-auto mb-4 text-gray-300" size={24} />
    <Link href="/login" className="bg-[#39bcba] text-white px-10 py-3 rounded-lg font-black text-xs uppercase inline-block">Войти</Link>
  </div>
);
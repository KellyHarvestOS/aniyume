'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { BiBug, BiEnvelope, BiMessageDetail, BiRocket, BiSend } from 'react-icons/bi';
import { submitContactMessage } from '@/lib/api';

const categories = [
  { value: 'bug', label: 'Баг / ошибка', icon: <BiBug /> },
  { value: 'idea', label: 'Идея', icon: <BiRocket /> },
  { value: 'feedback', label: 'Обратная связь', icon: <BiMessageDetail /> },
  { value: 'content', label: 'Контент', icon: <BiEnvelope /> },
  { value: 'other', label: 'Другое', icon: <BiMessageDetail /> },
];

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', category: 'bug', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setNotice('');
    try {
      const result = await submitContactMessage(form);
      setStatus('success');
      setNotice(result.message ?? 'Сообщение отправлено. Спасибо!');
      setForm({ name: '', email: '', category: 'bug', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setNotice(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    }
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-200 py-16 px-4 md:px-8 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[420px] bg-brand/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-24">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 rounded-3xl mb-8 text-brand shadow-lg shadow-brand/5">
            <BiEnvelope className="text-5xl" />
          </div>
          <p className="text-brand font-black uppercase tracking-[0.25em] text-sm mb-4">feedback hub</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6">
            Контакты <span className="text-brand">AniYume</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic">
            Нашёл баг, хочешь предложить фичу или написать разработчикам? Отправь сообщение сюда — оно попадёт прямо в админку команде AniYume.
          </p>
          <div className="mt-10 grid gap-4">
            {categories.slice(0, 4).map((item) => (
              <button key={item.value} onClick={() => setForm({ ...form, category: item.value })} className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${form.category === item.value ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#171717] text-slate-600 dark:text-gray-400 hover:border-brand/40'}`}>
                <span className="text-3xl">{item.icon}</span>
                <span className="font-black uppercase italic">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        <motion.form initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={submit} className="rounded-[3rem] border-2 border-brand/20 bg-slate-50/80 dark:bg-[#181818]/90 p-6 md:p-10 shadow-2xl shadow-brand/5 backdrop-blur">
          <div className="grid md:grid-cols-2 gap-5">
            <label className="grid gap-2"><span className="font-black uppercase text-sm text-gray-500 dark:text-gray-400">Имя</span><input className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] px-5 py-4 outline-none focus:border-brand" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Как к тебе обращаться" /></label>
            <label className="grid gap-2"><span className="font-black uppercase text-sm text-gray-500 dark:text-gray-400">Email</span><input className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] px-5 py-4 outline-none focus:border-brand" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="для ответа (необязательно)" type="email" /></label>
          </div>
          <label className="grid gap-2 mt-5"><span className="font-black uppercase text-sm text-gray-500 dark:text-gray-400">Категория</span><select className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] px-5 py-4 outline-none focus:border-brand" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="grid gap-2 mt-5"><span className="font-black uppercase text-sm text-gray-500 dark:text-gray-400">Тема</span><input required maxLength={180} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] px-5 py-4 outline-none focus:border-brand" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Например: не работает плеер на странице..." /></label>
          <label className="grid gap-2 mt-5"><span className="font-black uppercase text-sm text-gray-500 dark:text-gray-400">Сообщение</span><textarea required minLength={10} maxLength={5000} rows={9} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] px-5 py-4 outline-none focus:border-brand resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Опиши проблему, шаги воспроизведения, устройство/браузер или идею для улучшения." /></label>
          {notice ? <div className={`mt-5 rounded-2xl border p-4 font-bold ${status === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-500' : 'border-rose-400/30 bg-rose-400/10 text-rose-500'}`}>{notice}</div> : null}
          <button disabled={status === 'loading'} className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand px-8 py-5 text-lg font-black uppercase italic tracking-widest text-white shadow-2xl shadow-brand/30 transition hover:brightness-110 active:scale-95 disabled:opacity-60" type="submit">
            <BiSend className="text-2xl" /> {status === 'loading' ? 'Отправляем...' : 'Отправить разработчикам'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

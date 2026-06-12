'use client';

import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { submitContactMessage } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import {
  FaBug,
  FaLightbulb,
  FaCommentDots,
  FaClapperboard,
  FaWandMagicSparkles,
  FaPaperPlane,
  FaChevronDown,
  FaImage,
  FaXmark
} from 'react-icons/fa6';

const categories = [
  { value: 'bug', labelKey: 'contacts.catBug', icon: <FaBug /> },
  { value: 'idea', labelKey: 'contacts.catIdea', icon: <FaLightbulb /> },
  { value: 'feedback', labelKey: 'contacts.catFeedback', icon: <FaCommentDots /> },
  { value: 'content', labelKey: 'contacts.catContent', icon: <FaClapperboard /> },
  { value: 'other', labelKey: 'contacts.catOther', icon: <FaWandMagicSparkles /> },
];

interface ContactForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  attachment: File | null;
}

export default function ContactsPage() {
  const { t } = useI18n();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    category: 'bug',
    subject: '',
    message: '',
    attachment: null
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [notice, setNotice] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setNotice('');

    try {
      const result = await submitContactMessage(form);
      setStatus('success');
      setNotice(result.message ?? t('contacts.successDefault'));
      setForm({ name: '', email: '', category: 'bug', subject: '', message: '', attachment: null });
    } catch (error) {
      setStatus('error');
      setNotice(error instanceof Error ? error.message : t('contacts.errorDefault'));
    }
  }

  const selectedCategory = categories.find(c => c.value === form.category) || categories[0];

  return (
    <section className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-200 py-10 md:py-16 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div className="sticky  flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-gray-100 mb-6">
              {t('contacts.title1')} <span className="text-brand w-[20rem]">{t('contacts.title2')}</span>
            </h1>

            <div className="w-24 h-1.5 bg-brand rounded-full mb-6 shadow-lg shadow-brand/20 lg:mx-0 mx-auto" />

            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed mb-10 max-w-md">
              {t('contacts.intro')}
            </p>

            <div className="grid gap-3 w-full max-w-md">
              {categories.slice(0, 4).map((item) => {
                const isActive = form.category === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: item.value })}
                    className={`group flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-300 ${isActive
                        ? 'border-brand bg-brand text-white dark:text-gray-900 shadow-lg shadow-brand/20'
                        : 'border-transparent bg-gray-50 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:border-brand/50'
                      }`}
                  >
                    <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${isActive ? '' : 'group-hover:text-brand'}`}>
                      {item.icon}
                    </span>
                    <span className="font-bold uppercase tracking-wider text-sm">
                      {t(item.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={submit}
            className="rounded-3xl border border-gray-200 dark:border-[#232323] bg-white/80 dark:bg-[#151515]/80 p-6 md:p-8 shadow-xl backdrop-blur-md"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">{t('contacts.name')}</span>
                <input
                  required
                  className="rounded-xl border border-gray-200 dark:border-[#232323] bg-gray-50 dark:bg-[#111111] px-4 py-3 outline-none focus:border-brand dark:focus:border-brand transition-colors text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('contacts.namePlaceholder')}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">{t('contacts.email')}</span>
                <input
                  type="email"
                  className="rounded-xl border border-gray-200 dark:border-[#232323] bg-gray-50 dark:bg-[#111111] px-4 py-3 outline-none focus:border-brand dark:focus:border-brand transition-colors text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t('contacts.emailPlaceholder')}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 mb-5 relative" ref={dropdownRef}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">{t('contacts.category')}</span>

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 outline-none transition-colors text-sm ${isDropdownOpen
                    ? 'border-brand bg-white dark:bg-[#111111]'
                    : 'border-gray-200 dark:border-[#232323] bg-gray-50 dark:bg-[#111111] hover:border-brand/50 dark:hover:border-brand/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-base">{selectedCategory.icon}</span>
                  <span className="text-gray-800 dark:text-gray-200">{t(selectedCategory.labelKey)}</span>
                </div>
                <FaChevronDown
                  className={`text-gray-400 text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-brand' : ''}`}
                />
              </button>

              <div
                className={`absolute top-[72px] left-0 w-full z-50 bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#232323] rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${isDropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                  }`}
              >
                <div className="py-2">
                  {categories.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, category: item.value });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${form.category === item.value
                          ? 'bg-brand/10 text-brand font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                      <span className={`text-base ${form.category === item.value ? 'text-brand' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {t(item.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-2 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">{t('contacts.subject')}</span>
              <input
                required
                maxLength={180}
                className="rounded-xl border border-gray-200 dark:border-[#232323] bg-gray-50 dark:bg-[#111111] px-4 py-3 outline-none focus:border-brand dark:focus:border-brand transition-colors text-sm"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder={t('contacts.subjectPlaceholder')}
              />
            </label>

            <label className="flex flex-col gap-2 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">{t('contacts.message')}</span>
              <textarea
                required
                minLength={10}
                maxLength={5000}
                rows={7}
                className="rounded-xl border border-gray-200 dark:border-[#232323] bg-gray-50 dark:bg-[#111111] px-4 py-3 outline-none focus:border-brand dark:focus:border-brand transition-colors text-sm resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('contacts.messagePlaceholder')}
              />
            </label>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1 block mb-2">{t('contacts.screenshot')}</span>
              {!form.attachment ? (
                <label className="flex items-center justify-center gap-3 w-full rounded-xl border border-dashed border-gray-300 dark:border-[#333] hover:border-brand dark:hover:border-brand bg-gray-50/50 dark:bg-[#111]/50 px-4 py-4 cursor-pointer transition-colors text-sm text-gray-500 hover:text-brand">
                  <FaImage className="text-xl" />
                  <span>{t('contacts.attach')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setForm({ ...form, attachment: e.target.files[0] });
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-brand/50 bg-brand/5 px-4 py-3 text-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaImage className="text-brand flex-shrink-0 text-xl" />
                    <span className="truncate font-medium text-gray-800 dark:text-gray-200">
                      {form.attachment.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attachment: null })}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                  >
                    <FaXmark className="text-xl" />
                  </button>
                </div>
              )}
            </div>

            {notice && (
              <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-bold flex items-center justify-center text-center ${status === 'success'
                  ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                {notice}
              </div>
            )}

            <button
              disabled={status === 'loading'}
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 dark:text-gray-900 uppercase tracking-widest text-sm"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                  <span>{t('contacts.sending')}</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-lg" />
                  <span>{t('contacts.submit')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
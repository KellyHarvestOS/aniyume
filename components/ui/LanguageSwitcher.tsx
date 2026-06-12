'use client';

import { LANGUAGES } from '@/lib/i18n';
import { useI18n } from '@/contexts/I18nContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3 dark:border-white/5 dark:bg-[#161616]">
      {LANGUAGES.map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            aria-pressed={active}
            className={`group flex items-center gap-3 rounded-lg border p-4 transition-all active:scale-[0.98] ${
              active
                ? 'border-brand bg-brand/10'
                : 'border-slate-200 bg-white hover:border-brand/40 dark:border-white/5 dark:bg-[#111111]'
            }`}
          >
            <span className="text-2xl leading-none">{item.flag}</span>
            <span className="flex min-w-0 flex-col text-left">
              <span className={`truncate text-sm font-black ${active ? 'text-brand' : 'text-slate-700 dark:text-gray-300'}`}>
                {item.native}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {item.short}
              </span>
            </span>
            <span
              className={`ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                active ? 'border-brand bg-brand' : 'border-slate-300 dark:border-white/20'
              }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

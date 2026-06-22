'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LANGUAGES } from '@/lib/i18n';
import { useI18n } from '@/contexts/I18nContext';

export default function HeaderLanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n();

  const index = LANGUAGES.findIndex((item) => item.code === lang);
  const current = LANGUAGES[index === -1 ? 0 : index];

  const cycleLanguage = () => {
    const next = LANGUAGES[(index + 1) % LANGUAGES.length];
    setLang(next.code);
  };

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      aria-label={`Сменить язык, текущий: ${current.native}`}
      title={current.native}
      className={`group flex h-9 items-center gap-1.5 rounded-lg px-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 ${className}`}
    >
      <span className="text-base leading-none">{current.flag}</span>
      {/* Буквы меняются «в том же месте»: старый код уезжает вверх, новый приезжает снизу. */}
      <span className="relative inline-flex h-[1.25em] w-[1.7em] items-center justify-center overflow-hidden text-sm font-bold">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={current.code}
            initial={{ y: '-110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '110%', opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline-block"
          >
            {current.short}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

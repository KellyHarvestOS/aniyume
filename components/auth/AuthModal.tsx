'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useI18n } from '@/contexts/I18nContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function AuthModal() {
  const { view, openAuth, closeAuth } = useAuthModal();
  const { t } = useI18n();
  const isOpen = view !== null;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeAuth]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10 backdrop-blur-sm dark:bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative my-auto w-full ${view === 'register' ? 'max-w-2xl' : 'max-w-md'} rounded-2xl border border-[#2EC4B6]/30 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-[#0f0f0f] md:p-10`}
          >
            <button
              onClick={closeAuth}
              aria-label={t('auth.close')}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {view === 'login' && <LoginForm onSuccess={closeAuth} onSwitch={openAuth} />}
            {view === 'register' && <RegisterForm onSuccess={closeAuth} onSwitch={openAuth} />}
            {view === 'forgot' && <ForgotPasswordForm onSwitch={openAuth} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthToast from '@/components/ui/AuthToast';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import type { AuthModalView } from '@/contexts/AuthModalContext';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

type AuthResponse = {
  message?: string;
  ban_reason?: string | null;
  ban_expires_at?: string | null;
  token?: string;
  access_token?: string;
  user?: unknown;
  data?: { token?: string; access_token?: string; user?: unknown };
};

type LoginUser = Parameters<ReturnType<typeof useAuth>['login']>[1];

type LoginFormData = { email: string; password: string; bot_check?: string };

const getErrorMessage = (error: unknown, t: TranslateFn) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return t('auth.login.failed');
};

const formatBanMessage = (response: AuthResponse, t: TranslateFn) => {
  if (!response.ban_reason && !response.ban_expires_at) return response.message || t('auth.ban.blocked');
  const until = response.ban_expires_at ? t('auth.ban.until', { date: new Date(response.ban_expires_at).toLocaleString() }) : t('auth.ban.forever');
  return `${response.message || t('auth.ban.blocked')}${response.ban_reason ? t('auth.ban.reason', { reason: response.ban_reason }) : ''}${until}`;
};

const readJson = async (res: Response): Promise<AuthResponse> => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as AuthResponse;
  } catch {
    return { message: text };
  }
};

const MOCK_LOGIN_EMAIL = 'vladjjjsss7@gmail.com';

type LoginField = keyof Pick<LoginFormData, 'email' | 'password'>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitch: (view: AuthModalView) => void;
}

export default function LoginForm({ onSuccess, onSwitch }: LoginFormProps) {
  const { login } = useAuth();
  const { t } = useI18n();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'danger' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === 'email' || id === 'password') {
      setFieldErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const showToast = (title: string, message: string, type: 'success' | 'danger') =>
    setToast({ isOpen: true, title, message, type });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      if (formData.email.trim().toLowerCase() === MOCK_LOGIN_EMAIL && formData.password === MOCK_LOGIN_EMAIL) {
        localStorage.setItem('userToken', 'mock-premium-user-token');
        localStorage.setItem('userData', JSON.stringify({ id: 'mock-premium-user', name: 'vladjjjsss7', email: MOCK_LOGIN_EMAIL }));
        window.dispatchEvent(new Event('authChange'));
        showToast(t('auth.login.successTitle'), t('auth.login.testSuccessMsg'), 'success');
        window.setTimeout(() => onSuccess?.(), 900);
        return;
      }

      const res = await fetch('/api/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await readJson(res);

      if (!res.ok) {
        throw new Error(res.status === 403 ? formatBanMessage(responseData, t) : responseData.message || t('auth.login.invalid'));
      }

      const token = responseData.data?.token || responseData.data?.access_token || responseData.token || responseData.access_token;
      const user = responseData.data?.user || responseData.user;

      if (!token) throw new Error(t('auth.login.noToken'));

      login(token, (user as LoginUser | undefined) || { id: 0, name: '', email: formData.email });
      showToast(t('auth.login.successTitle'), t('auth.login.successMsg'), 'success');
      window.setTimeout(() => onSuccess?.(), 900);
    } catch (error: unknown) {
      const message = getErrorMessage(error, t);
      setFieldErrors({ email: message, password: message });
      showToast(t('auth.login.errorTitle'), message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthToast isOpen={toast.isOpen} title={toast.title} message={toast.message} type={toast.type} />

      <h1 className="mb-2 flex items-center justify-center gap-3 text-center text-3xl font-black uppercase italic tracking-tighter text-[#2EC4B6]">
        <FaSignInAlt className="text-2xl" /> {t('auth.login.title')}
      </h1>
      <p className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
        {t('auth.login.subtitle')}
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6]">
            {t('auth.email')}
          </label>
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              aria-invalid={!!fieldErrors.email}
              className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:ring-2 dark:bg-[#111111] dark:text-gray-200 ${fieldErrors.email
                ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:ring-red-400/30 dark:border-red-500/70'
                : 'border-gray-200 focus:ring-[#2EC4B6]/50 dark:border-white/5'}`}
              required
            />
          </div>
          {fieldErrors.email && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6]">
            {t('auth.login.passwordLabel')}
          </label>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-invalid={!!fieldErrors.password}
              className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-12 pr-12 text-sm font-bold text-gray-700 outline-none transition focus:ring-2 dark:bg-[#111111] dark:text-gray-200 ${fieldErrors.password
                ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:ring-red-400/30 dark:border-red-500/70'
                : 'border-gray-200 focus:ring-[#2EC4B6]/50 dark:border-white/5'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors focus:outline-none"
            >
              {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500">{fieldErrors.password}</p>}
        </div>

        <div className="flex justify-end -mt-2">
          <button
            type="button"
            onClick={() => onSwitch('forgot')}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-[#2EC4B6]"
          >
            {t('auth.login.forgot')}
          </button>
        </div>

        {/* Honeypot */}
        <div aria-hidden="true" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}>
          <label htmlFor="bot_check">Не заполняйте это поле / Leave this blank</label>
          <input type="text" id="bot_check" name="bot_check" value={formData.bot_check || ''} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#2EC4B6] py-4 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:bg-[#259B92] active:scale-95 disabled:opacity-50"
        >
          {loading ? t('auth.processing') : t('auth.login.submit')}
        </button>

        <div className="flex flex-col items-center pt-2 text-center">
          <button
            type="button"
            onClick={() => onSwitch('register')}
            className="text-[11px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-[#2EC4B6]"
          >
            {t('auth.login.noAccount')} <span className="text-[#2EC4B6] underline">{t('auth.login.registerLink')}</span>
          </button>
        </div>
      </form>
    </>
  );
}

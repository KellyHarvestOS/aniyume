'use client';

import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import AuthToast from '@/components/ui/AuthToast';
import type { AuthModalView } from '@/contexts/AuthModalContext';

type ApiResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

const readJson = async (res: Response): Promise<ApiResponse> => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return { message: text };
  }
};

const firstError = (data: ApiResponse, fallback: string) => {
  if (data.errors) {
    const value = Object.values(data.errors)[0];
    if (value) return Array.isArray(value) ? value[0] : value;
  }
  return data.message || fallback;
};

type Step = 'email' | 'code' | 'reset';

interface ForgotPasswordFormProps {
  onSwitch: (view: AuthModalView) => void;
}

export default function ForgotPasswordForm({ onSwitch }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'danger' });

  const showToast = (title: string, message: string, type: 'success' | 'danger') => setToast({ isOpen: true, title, message, type });

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/external/auth/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        const message = res.status === 429 ? 'Слишком много запросов. Попробуйте позже.' : firstError(data, 'Не удалось отправить код');
        setError(message);
        showToast('Ошибка', message, 'danger');
        return;
      }
      showToast('Код отправлен', 'Проверьте почту и введите 6-значный код.', 'success');
      setStep('code');
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/external/auth/password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        const message = firstError(data, 'Неверный код');
        setError(message);
        showToast('Ошибка', message, 'danger');
        return;
      }
      setStep('reset');
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/external/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password, password_confirmation: confirmPassword }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        const message = firstError(data, 'Не удалось сбросить пароль');
        setError(message);
        showToast('Ошибка', message, 'danger');
        return;
      }
      showToast('Готово', 'Пароль обновлён. Войдите с новым паролем.', 'success');
      window.setTimeout(() => onSwitch('login'), 900);
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:ring-2 focus:ring-[#2EC4B6]/50 dark:bg-[#111111] dark:text-gray-200';

  return (
    <>
      <AuthToast isOpen={toast.isOpen} title={toast.title} message={toast.message} type={toast.type} />

      <h1 className="mb-2 flex items-center justify-center gap-3 text-center text-3xl font-black uppercase italic tracking-tighter text-[#2EC4B6]">
        <FaKey className="text-2xl" /> Сброс пароля
      </h1>
      <p className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
        {step === 'email' && 'Введите email для получения кода'}
        {step === 'code' && 'Введите код из письма'}
        {step === 'reset' && 'Придумайте новый пароль'}
      </p>

      {step === 'email' && (
        <form className="space-y-6" onSubmit={requestCode}>
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL@EXAMPLE.COM" className={inputClass} required />
          </div>
          {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#2EC4B6] py-4 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:bg-[#259B92] active:scale-95 disabled:opacity-50">
            {loading ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ КОД'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form className="space-y-6" onSubmit={verifyCode}>
          <div className="relative group">
            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className={`${inputClass} tracking-[0.5em] text-center`}
              required
            />
          </div>
          {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>}
          <button type="submit" disabled={loading || code.length < 6} className="w-full rounded-xl bg-[#2EC4B6] py-4 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:bg-[#259B92] active:scale-95 disabled:opacity-50">
            {loading ? 'ПРОВЕРКА...' : 'ПОДТВЕРДИТЬ КОД'}
          </button>
          <button type="button" onClick={requestCode} disabled={loading} className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2EC4B6] transition-colors disabled:opacity-50">
            Отправить код повторно
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form className="space-y-6" onSubmit={resetPassword}>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="НОВЫЙ ПАРОЛЬ" className={`${inputClass} pr-12`} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors">
              {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="ПОВТОР ПАРОЛЯ" className={inputClass} required />
          </div>
          {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#2EC4B6] py-4 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:bg-[#259B92] active:scale-95 disabled:opacity-50">
            {loading ? 'СОХРАНЕНИЕ...' : 'СБРОСИТЬ ПАРОЛЬ'}
          </button>
        </form>
      )}

      <div className="flex flex-col items-center pt-6 text-center">
        <button type="button" onClick={() => onSwitch('login')} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-[#2EC4B6]">
          <FaArrowLeft size={10} /> Вернуться ко входу
        </button>
      </div>
    </>
  );
}

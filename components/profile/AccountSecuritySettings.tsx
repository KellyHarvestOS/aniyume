'use client';

import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useI18n } from '@/contexts/I18nContext';

type Props = {
  email: string;
  onEmailChange: (email: string) => void;
};

type ApiResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
  user?: { email?: string };
};

const firstError = (data: ApiResponse) => {
  const error = data.errors ? Object.values(data.errors)[0] : null;
  return (Array.isArray(error) ? error[0] : error) || data.message || 'Не удалось обновить данные аккаунта';
};

export default function AccountSecuritySettings({ email, onEmailChange }: Props) {
  const { t } = useI18n();
  const [nextEmail, setNextEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async () => {
    setMessage(null);

    if (!nextEmail.trim() || !currentPassword) {
      setMessage({ type: 'error', text: 'Укажите email и текущий пароль' });
      return;
    }

    if (password && password !== passwordConfirmation) {
      setMessage({ type: 'error', text: 'Новые пароли не совпадают' });
      return;
    }

    const payload: Record<string, string> = { current_password: currentPassword };
    if (nextEmail.trim().toLowerCase() !== email.toLowerCase()) payload.email = nextEmail.trim();
    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    if (!payload.email && !payload.password) {
      setMessage({ type: 'error', text: 'Укажите новый email или пароль' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/external/profile/me/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({})) as ApiResponse;
      if (!response.ok) throw new Error(firstError(data));

      const updatedEmail = data.user?.email || nextEmail.trim();
      onEmailChange(updatedEmail);
      setNextEmail(updatedEmail);
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setMessage({ type: 'success', text: 'Email и пароль успешно обновлены' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Не удалось обновить данные аккаунта' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-white/5 dark:bg-[#161616] dark:text-white';

  return (
    <section className="md:col-span-2 space-y-5 rounded-xl border border-slate-200 bg-slate-50/60 p-6 dark:border-white/10 dark:bg-[#161616]">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
          <FaShieldAlt className="text-brand" /> {t('account.securityTitle')}
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-400">Для смены email или пароля укажите текущий пароль.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-gray-200">
            <FaEnvelope className="text-brand" /> Email
          </span>
          <input type="email" value={nextEmail} onChange={(event) => setNextEmail(event.target.value)} className={inputClass} required />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-gray-200">
            <FaLock className="text-brand" /> Текущий пароль
          </span>
          <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} autoComplete="current-password" required />
        </label>

        <label className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-gray-200">Новый пароль</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} minLength={8} autoComplete="new-password" placeholder="Оставьте пустым, если не меняете" />
        </label>

        <label className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-gray-200">Повтор нового пароля</span>
          <input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className={inputClass} minLength={8} autoComplete="new-password" />
        </label>

        {message && (
          <p className={`md:col-span-2 rounded-lg border p-3 text-sm font-bold ${message.type === 'success' ? 'border-green-500/20 bg-green-500/10 text-green-500' : 'border-red-500/20 bg-red-500/10 text-red-500'}`}>
            {message.text}
          </p>
        )}

        <button type="button" onClick={handleSubmit} disabled={saving} className="md:col-span-2 rounded-lg bg-brand px-8 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:scale-[1.01] disabled:opacity-50 dark:text-black">
          {saving ? 'Сохранение...' : 'Обновить email или пароль'}
        </button>
      </div>
    </section>
  );
}

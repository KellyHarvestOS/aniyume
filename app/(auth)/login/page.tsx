'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthBackground from '@/components/layout/AuthBackground';
import Modal from '@/components/modals/ErrorModal';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'danger',
    onConfirm: () => { },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const openAlert = (title: string, message: string, type: 'success' | 'danger', action?: () => void) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: action || (() => { }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Неверный логин или пароль');
      }

      const token = responseData.data?.token || responseData.token || responseData.access_token;
      const user = responseData.data?.user || responseData.user;

      if (!token) {
        throw new Error('Ошибка авторизации: токен отсутствует');
      }

      localStorage.setItem('userToken', token);
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
      }

      openAlert('С возвращением!', 'Вы успешно вошли в систему AniYume.', 'success', () => {
        router.push('/');
      });
    } catch (error: any) {
      openAlert('Ошибка входа', error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText="Понятно"
        cancelText="Закрыть"
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
      />

      <div className="w-full max-w-md rounded-xl border border-[#2EC4B6]/30 dark:border-gray-800 bg-white/10 dark:bg-[#0f0f0f]/40 p-10 shadow-2xl backdrop-blur-sm transition-colors">
        <h1 className="mb-2 flex items-center justify-center gap-3 text-center text-4xl font-black uppercase italic tracking-tighter text-[#2EC4B6]">
          <FaSignInAlt className="text-3xl" /> Вход
        </h1>

        <p className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
          Авторизация в системе AniYume
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6]">
              Email Адрес
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL@EXAMPLE.COM"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:ring-2 focus:ring-[#2EC4B6]/50 dark:border-white/5 dark:bg-[#111111] dark:text-gray-200"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 ml-1 block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6]">
              Пароль аккаунта
            </label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm font-bold text-gray-700 outline-none transition focus:ring-2 focus:ring-[#2EC4B6]/50 dark:border-white/5 dark:bg-[#111111] dark:text-gray-200"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2EC4B6] py-4 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:bg-[#259B92] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'ОБРАБОТКА...' : 'ВОЙТИ В ПРОФИЛЬ'}
          </button>

          <div className="flex flex-col items-center pt-4 text-center">
            <Link
              href="/register"
              className="text-[11px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-[#2EC4B6]"
            >
              Нет аккаунта? <span className="text-[#2EC4B6] underline">Зарегистрироваться</span>
            </Link>
          </div>
        </form>
      </div>
    </AuthBackground>
  );
};

export default LoginPage;
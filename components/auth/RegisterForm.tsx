'use client';

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaRegAddressCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthToast from '@/components/ui/AuthToast';
import { useAuth } from '@/contexts/AuthContext';
import DatePicker from '@/components/ui/DatePicker';
import type { AuthModalView } from '@/contexts/AuthModalContext';

type RegisterResponse = {
  message?: string;
  token?: string;
  access_token?: string;
  user?: unknown;
  errors?: Record<string, string[] | string>;
  data?: { token?: string; access_token?: string; user?: unknown };
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Не удалось создать аккаунт. Попробуйте позже.';
};

const readJson = async (res: Response): Promise<RegisterResponse> => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as RegisterResponse;
  } catch {
    return { message: text };
  }
};

type RegisterUser = Parameters<ReturnType<typeof useAuth>['login']>[1];
type RegisterField = 'username' | 'dateOfBirth' | 'email' | 'password' | 'confirmPassword';

const inputClassName = (hasError?: boolean, className = '') => `w-full h-[52px] rounded-xl border bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 transition-all font-bold text-sm ${hasError
  ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:ring-red-400/30 dark:border-red-500/70'
  : 'border-gray-200 dark:border-white/5 focus:ring-[#2EC4B6]/50'} ${className}`;

const backendFieldMap: Record<string, RegisterField> = {
  name: 'username',
  username: 'username',
  age: 'dateOfBirth',
  dateOfBirth: 'dateOfBirth',
  birth_date: 'dateOfBirth',
  email: 'email',
  password: 'password',
  password_confirmation: 'confirmPassword',
  confirmPassword: 'confirmPassword',
};

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitch: (view: AuthModalView) => void;
}

export default function RegisterForm({ onSuccess, onSwitch }: RegisterFormProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', dateOfBirth: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'danger' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id in formData) setFieldErrors((prev) => ({ ...prev, [id as RegisterField]: undefined }));
  };

  const handleDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
    setFieldErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
  };

  const showToast = (title: string, message: string, type: 'success' | 'danger') => setToast({ isOpen: true, title, message, type });
  const markFieldInvalid = (field: RegisterField, message: string) => setFieldErrors((prev) => ({ ...prev, [field]: message }));
  const renderFieldError = (field: RegisterField) => fieldErrors[field]
    ? <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500">{fieldErrors[field]}</p>
    : null;

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const validateForm = () => {
    setFieldErrors({});
    if (!formData.username.trim()) {
      const message = 'Введите имя пользователя';
      markFieldInvalid('username', message);
      showToast('Ошибка', message, 'danger');
      return false;
    }
    if (!formData.dateOfBirth) {
      const message = 'Пожалуйста, выберите дату рождения';
      markFieldInvalid('dateOfBirth', message);
      showToast('Ошибка', message, 'danger');
      return false;
    }
    const calculatedAge = calculateAge(formData.dateOfBirth);
    if (calculatedAge < 1 || calculatedAge > 100) {
      const message = `Ваш вычисленный возраст: ${calculatedAge}. Значение должно быть от 1 до 100 лет.`;
      markFieldInvalid('dateOfBirth', message);
      showToast('Неверный возраст', message, 'danger');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const message = 'Введите корректный адрес электронной почты';
      markFieldInvalid('email', message);
      showToast('Ошибка Email', message, 'danger');
      return false;
    }
    if (formData.password.length < 6) {
      const message = 'Пароль должен содержать минимум 6 символов';
      markFieldInvalid('password', message);
      showToast('Слабый пароль', message, 'danger');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      const message = 'Пароли не совпадают. Проверьте правильность ввода.';
      markFieldInvalid('password', message);
      markFieldInvalid('confirmPassword', message);
      showToast('Ошибка пароля', message, 'danger');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const age = calculateAge(formData.dateOfBirth);
    try {
      const res = await fetch('/api/external/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username,
          age: age.toString(),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });
      const responseData = await readJson(res);
      if (!res.ok) {
        let errorMessage = responseData.message || 'Ошибка регистрации';
        if (responseData.errors) {
          Object.entries(responseData.errors).forEach(([field, value]) => {
            const mappedField = backendFieldMap[field];
            if (!mappedField) return;
            const message = Array.isArray(value) ? value[0] : value;
            markFieldInvalid(mappedField, message);
          });
          const firstError = Object.values(responseData.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError || 'Ошибка валидации';
        }
        showToast('Регистрация отклонена', errorMessage, 'danger');
        return;
      }
      const token = responseData.data?.token || responseData.data?.access_token || responseData.token || responseData.access_token;
      const user = responseData.data?.user || responseData.user;
      if (token) {
        login(token, (user as RegisterUser | undefined) || { id: 0, name: formData.username, email: formData.email });
        showToast('Успех!', 'Ваш аккаунт создан. Приятного просмотра аниме!', 'success');
        window.setTimeout(() => onSuccess?.(), 900);
      } else {
        showToast('Почти готово', 'Регистрация прошла успешно! Теперь войдите в свой аккаунт.', 'success');
        window.setTimeout(() => onSwitch('login'), 900);
      }
    } catch (error: unknown) {
      showToast('Сбой сервера', getErrorMessage(error), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthToast isOpen={toast.isOpen} title={toast.title} message={toast.message} type={toast.type} />

      <h1 className="text-3xl font-black italic tracking-tighter mb-2 text-center text-[#2EC4B6] flex items-center justify-center gap-3 uppercase">
        <FaUserPlus className="text-2xl" /> Регистрация
      </h1>
      <p className="text-gray-400 mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
        Создайте аккаунт в системе AniYume
      </p>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-5 gap-y-5">
          <div className="md:col-span-6 flex flex-col">
            <label htmlFor="username" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">Имя пользователя</label>
            <div className="relative group">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
              <input id="username" type="text" value={formData.username} onChange={handleChange} placeholder="ВАШ НИКНЕЙМ" aria-invalid={!!fieldErrors.username} className={inputClassName(!!fieldErrors.username, 'pl-12 pr-4')} />
            </div>
            {renderFieldError('username')}
          </div>

          <div className="md:col-span-4 flex flex-col">
            <label htmlFor="dateOfBirth" className="block text-[10px] font-black uppercase tracking-tight text-[#2EC4B6] mb-2 ml-1 h-4 whitespace-nowrap overflow-hidden">Дата рождения</label>
            <DatePicker id="dateOfBirth" value={formData.dateOfBirth} onChange={handleDateChange} hasError={!!fieldErrors.dateOfBirth} />
            {renderFieldError('dateOfBirth')}
          </div>

          <div className="md:col-span-10 flex flex-col">
            <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">Email Адрес</label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
              <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="EMAIL@EXAMPLE.COM" aria-invalid={!!fieldErrors.email} className={inputClassName(!!fieldErrors.email, 'pl-12 pr-4')} />
            </div>
            {renderFieldError('email')}
          </div>

          <div className="md:col-span-5 flex flex-col">
            <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">Пароль</label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
              <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" aria-invalid={!!fieldErrors.password} className={inputClassName(!!fieldErrors.password, 'pl-12 pr-10')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors z-10">
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {renderFieldError('password')}
          </div>

          <div className="md:col-span-5 flex flex-col">
            <label htmlFor="confirmPassword" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">Повтор пароля</label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
              <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" aria-invalid={!!fieldErrors.confirmPassword} className={inputClassName(!!fieldErrors.confirmPassword, 'pl-12 pr-10')} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors z-10">
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {renderFieldError('confirmPassword')}
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full bg-[#2EC4B6] hover:bg-[#259B92] text-white font-black uppercase italic tracking-[0.2em] h-14 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#2EC4B6]/25 disabled:opacity-50 active:scale-[0.98] text-xs">
            {loading ? 'ОБРАБОТКА...' : <><FaRegAddressCard className="text-lg" /> Зарегистрироваться</>}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 text-center">
        <button type="button" onClick={() => onSwitch('login')} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2EC4B6] transition-colors">
          Уже есть аккаунт? <span className="text-[#2EC4B6] underline">Войти</span>
        </button>
      </div>
    </>
  );
}

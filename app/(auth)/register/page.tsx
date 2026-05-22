"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaRegAddressCard,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import AuthBackground from "@/components/layout/AuthBackground";
import Modal from "@/components/modals/ErrorModal";
import DatePicker from "@/components/ui/DatePicker";

type RegisterResponse = {
  message?: string;
  token?: string;
  access_token?: string;
  user?: unknown;
  errors?: Record<string, string[] | string>;
  data?: {
    token?: string;
    access_token?: string;
    user?: unknown;
  };
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Не удалось создать аккаунт. Попробуйте позже.";
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

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "danger",
    onConfirm: () => { },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
  };

  const openAlert = (title: string, message: string, type: "success" | "danger", action?: () => void) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: action || (() => { }),
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      openAlert("Ошибка", "Введите имя пользователя", "danger");
      return false;
    }
    if (!formData.dateOfBirth) {
      openAlert("Ошибка", "Пожалуйста, выберите дату рождения", "danger");
      return false;
    }
    const calculatedAge = calculateAge(formData.dateOfBirth);
    if (calculatedAge < 1 || calculatedAge > 100) {
      openAlert("Неверный возраст", `Ваш вычисленный возраст: ${calculatedAge}. Значение должно быть от 1 до 100 лет.`, "danger");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      openAlert("Ошибка Email", "Введите корректный адрес электронной почты", "danger");
      return false;
    }
    if (formData.password.length < 6) {
      openAlert("Слабый пароль", "Пароль должен содержать минимум 6 символов", "danger");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      openAlert("Ошибка пароля", "Пароли не совпадают. Проверьте правильность ввода.", "danger");
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
      const res = await fetch("/api/external/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        let errorMessage = responseData.message || "Ошибка регистрации";
        if (responseData.errors) {
          const firstError = Object.values(responseData.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : "Ошибка валидации";
        }
        openAlert("Регистрация отклонена", errorMessage, "danger");
        return;
      }
      const token = responseData.data?.token || responseData.data?.access_token || responseData.token || responseData.access_token;
      const user = responseData.data?.user || responseData.user;
      if (token) {
        localStorage.setItem("userToken", token);
        if (user) localStorage.setItem("userData", JSON.stringify(user));
        window.dispatchEvent(new Event("authChange"));
        openAlert("Успех!", "Ваш аккаунт создан. Приятного просмотра аниме!", "success", () => {
          router.push("/");
        });
      } else {
        openAlert("Почти готово", "Регистрация прошла успешно! Теперь войдите в свой аккаунт.", "success", () => {
          router.push("/login");
        });
      }
    } catch (error: unknown) {
      openAlert("Сбой сервера", getErrorMessage(error), "danger");
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

      <div className="bg-white/10 dark:bg-[#0f0f0f]/40 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl border border-[#2EC4B6]/30 dark:border-gray-800 backdrop-blur-sm transition-colors mx-auto">
        <h1 className="text-4xl font-black italic tracking-tighter mb-2 text-center text-[#2EC4B6] flex items-center justify-center gap-3 uppercase">
          <FaUserPlus className="text-3xl" /> Регистрация
        </h1>

        <p className="text-gray-400 mb-8 text-center text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
          Создайте аккаунт в системе AniYume
        </p>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-x-5 gap-y-5">

            <div className="md:col-span-6 flex flex-col">
              <label htmlFor="username" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">
                Имя пользователя
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ВАШ НИКНЕЙМ"
                  className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col">
              <label htmlFor="dateOfBirth" className="block text-[10px] font-black uppercase tracking-tight text-[#2EC4B6] mb-2 ml-1 h-4 whitespace-nowrap overflow-hidden">
                Дата рождения
              </label>
              <DatePicker id="dateOfBirth" value={formData.dateOfBirth} onChange={handleDateChange} />
            </div>

            <div className="md:col-span-10 flex flex-col">
              <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">
                Email Адрес
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="EMAIL@EXAMPLE.COM"
                  className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col">
              <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">
                Пароль
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-[52px] pl-12 pr-10 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 transition-all font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors z-10"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col">
              <label htmlFor="confirmPassword" className="block text-[11px] font-black uppercase tracking-widest text-[#2EC4B6] mb-2 ml-1 h-4">
                Повтор пароля
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors z-10" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-[52px] pl-12 pr-10 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 transition-all font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2EC4B6] transition-colors z-10"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2EC4B6] hover:bg-[#259B92] text-white font-black uppercase italic tracking-[0.2em] h-14 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#2EC4B6]/25 disabled:opacity-50 active:scale-[0.98] text-xs"
            >
              {loading ? "ОБРАБОТКА..." : <><FaRegAddressCard className="text-lg" /> Зарегистрироваться</>}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
          <Link
            href="/login"
            className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2EC4B6] transition-colors"
          >
            Уже есть аккаунт? <span className="text-[#2EC4B6] underline">Войти</span>
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
};

export default RegisterPage;

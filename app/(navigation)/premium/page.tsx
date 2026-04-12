'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaCrown, FaCheck, FaCreditCard, FaLock, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function PremiumPage() {
  const { user, login, token } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Checkout, 3: Success

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Имитация задержки оплаты
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const res = await api.post('/payment/premium', {});
      const data = await res.json();

      if (res.ok) {
        // Обновляем пользователя в контексте
        if (token && data.user) {
          login(token, data.user);
        }
        setStep(3);
      } else {
        alert(data.message || 'Ошибка оплаты');
      }
    } catch (error) {
       console.error(error);
       alert('Произошла ошибка при обработке платежа');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-brand blur-2xl opacity-40 animate-pulse"></div>
             <div className="relative bg-brand text-black w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl">
                <FaCrown />
             </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">ВЫ ТЕПЕРЬ PREMIUM!</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Спасибо за вашу поддержку. Теперь вам доступны все функции Aniyume без ограничений.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
          >
            В личный кабинет
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Левая часть: Описание */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-xs font-black uppercase tracking-widest">
                <FaCrown /> Aniyume Premium
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter">
                УЛЬТИМАТИВНЫЙ <span className="text-brand">ОПЫТ</span> ПРОСМОТРА
              </h1>
              <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                Получите доступ к эксклюзивным функциям, отсутствию рекламы и поддержке вашего любимого проекта.
              </p>
              
              <ul className="space-y-4">
                {[
                  { icon: <FaShieldAlt className="text-brand" />, text: 'Полное отсутствие рекламы в плеере' },
                  { icon: <FaRocket className="text-brand" />, text: 'Приоритетная загрузка видео 4K' },
                  { icon: <FaCheck className="text-brand" />, text: 'Доступ к редким вариантам озвучки' },
                  { icon: <FaCheck className="text-brand" />, text: 'Золотая рамка и статус в комментариях' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300 font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Правая часть: Карточка тарифа */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand/20 blur-[120px] rounded-full"></div>
              <div className="relative bg-[#111111] border border-white/10 p-10 rounded-[32px] shadow-2xl space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-wider">Месячная подписка</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">299₽</span>
                    <span className="text-gray-500 font-medium">/ месяц</span>
                  </div>
                </div>

                <div className="p-6 bg-brand/5 border border-brand/10 rounded-2xl">
                   <p className="text-sm text-brand font-bold">Вы экономите 15%, оформляя автопродление</p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-brand text-black font-black uppercase tracking-widest rounded-2xl text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20 group"
                >
                  Оформить Premium
                </button>
                
                <p className="text-center text-xs text-gray-500 font-medium">
                  Отменить можно в любое время в настройках профиля
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ШАГ 2: Оплата (Фейк) */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
               <h2 className="text-3xl font-black uppercase tracking-tight">Оплата подписки</h2>
               <p className="text-gray-400 font-medium">Введите данные вашей карты для завершения</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Фейковая карта */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-20">
                    <FaCreditCard size={120} />
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Номер карты</label>
                       <input 
                         required
                         type="text" 
                         placeholder="0000 0000 0000 0000"
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl font-mono tracking-widest focus:border-brand focus:ring-0 transition-colors"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">ММ / ГГ</label>
                          <input 
                            required
                            type="text" 
                            placeholder="12/28"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand focus:ring-0 transition-colors"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CVC</label>
                          <input 
                            required
                            type="password" 
                            placeholder="***"
                            maxLength={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand focus:ring-0 transition-colors"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                 <FaLock className="text-emerald-500 text-xs" />
                 <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Безопасное соединение SSL (AES-256)</p>
              </div>

              <button
                disabled={isProcessing}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? 'Обработка...' : 'Подтвердить оплату 299₽'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Назад к описанию
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
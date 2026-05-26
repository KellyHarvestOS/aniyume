'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUserLock,
  FaDatabase,
  FaServer,
  FaFingerprint,
  FaEnvelopeOpenText,
  FaShieldAlt,
  FaTrashAlt,
} from 'react-icons/fa';

export default function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-brand/10 rounded-3xl mb-6 text-brand">
            <FaShieldAlt className="text-4xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white mb-6">
            Политика <span className="text-brand">конфиденциальности</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Ваша приватность — наш приоритет. Мы собираем только те данные, которые необходимы для полноценной работы сервиса.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <PolicySection
            variants={itemVariants}
            icon={<FaUserLock />}
            title="1. Данные аккаунта"
          >
            При регистрации мы запрашиваем минимальный набор данных: <strong>Имя пользователя (никнейм)</strong> и <strong>Email</strong>. Пароли хранятся исключительно в зашифрованном виде (Hash). Мы не имеем доступа к вашему паролю в открытом виде.
          </PolicySection>

          <PolicySection
            variants={itemVariants}
            icon={<FaDatabase />}
            title="2. История и списки"
          >
            Для обеспечения синхронизации между вашими устройствами мы сохраняем информацию о просмотренных сериях, текущем прогрессе в плеере и списки аниме («Смотрю», «В планах» и т.д.). Эти данные привязаны к вашему профилю.
          </PolicySection>

          <PolicySection
            variants={itemVariants}
            icon={<FaServer />}
            title="3. Техническая информация"
          >
            Наши серверы могут автоматически регистрировать стандартную техническую информацию: IP-адрес, тип браузера, время посещения. Это необходимо исключительно для защиты от спама, предотвращения кибератак и анализа общей аудитории сайта.
          </PolicySection>

          <PolicySection
            variants={itemVariants}
            icon={<FaFingerprint />}
            title="4. Передача данных"
          >
            AniYume <strong>не продает</strong> и не передает ваши персональные данные третьим лицам. Мы используем публичные API (Kodik, Shikimori) только для отображения контента. Ваш профиль на AniYume остается полностью изолированным.
          </PolicySection>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-white/5 rounded-3xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold dark:text-white mb-4 italic uppercase">Управление данными</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Вы имеете полное право в любой момент изменить данные своего профиля или полностью удалить аккаунт через настройки. При удалении аккаунта все связанные с ним данные стираются безвозвратно.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[200px]">
              <Link
                href="/profile"
                className="flex items-center justify-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold hover:brightness-110 shadow-lg shadow-brand/10 transition-all"
              >
                Настройки профиля
              </Link>
              <Link
                href="mailto:privacy@aniyume.com"
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 dark:text-gray-200 px-6 py-3 rounded-2xl font-bold hover:bg-white dark:hover:bg-white/5 transition-all text-sm"
              >
                <FaEnvelopeOpenText /> Вопросы по данным
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PolicySection({ icon, title, children, variants }: { icon: React.ReactNode; title: string; children: React.ReactNode; variants: any }) {
  return (
    <motion.div
      variants={variants}
      className="group p-8 bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-brand/10 rounded-xl text-brand text-xl group-hover:bg-brand group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h2 className="text-xl font-black italic uppercase tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold text-base">
        {children}
      </div>
    </motion.div>
  );
}

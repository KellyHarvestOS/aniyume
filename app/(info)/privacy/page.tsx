'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUserLock,
  FaDatabase,
  FaServer,
  FaFingerprint,
} from 'react-icons/fa6';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function PrivacyPage() {
  return (
    <section className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-200 py-10 md:py-16 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-gray-100 mb-6">
            Политика <span className="text-brand">конфиденциальности</span>
          </h1>

          <div className="w-24 h-1.5 bg-brand rounded-full mb-6 shadow-lg shadow-brand/20 mx-auto" />

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Ваша приватность — наш приоритет. Мы собираем только те данные, которые необходимы для полноценной работы сервиса.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
      </motion.div>
    </section>
  );
}

function PolicySection({ icon, title, children, variants }: { icon: React.ReactNode; title: string; children: React.ReactNode; variants: any }) {
  return (
    <motion.div
      variants={variants}
      className="group flex flex-col rounded-3xl border border-gray-200 dark:border-[#232323] bg-white/80 dark:bg-[#151515]/80 p-6 md:p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-brand/50 dark:hover:border-brand/50"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl text-gray-400 group-hover:text-brand transition-all duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}
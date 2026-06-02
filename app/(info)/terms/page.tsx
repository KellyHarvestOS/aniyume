'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCopyright,
  FaShieldHalved,
  FaBan,
  FaGavel,
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

export default function TermsPage() {
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
            Условия <span className="text-brand w-auto">использованияㅤ</span>
          </h1>

          <div className="w-24 h-1.5 bg-brand rounded-full mb-6 shadow-lg shadow-brand/20 mx-auto" />

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Пожалуйста, внимательно ознакомьтесь с правилами использования платформы AniYume. Пользование сайтом означает ваше согласие с данными условиями.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <TermSection
            variants={itemVariants}
            icon={<FaCopyright />}
            title="1. Статус контента"
          >
            AniYume является <strong>индексатором</strong> (поисковой системой). Мы не храним видеофайлы на собственных серверах. Весь контент транслируется из открытых сторонних источников (Kodik, Anilibria). Мы не несем ответственности за содержание, доступность или качество внешних ресурсов.
          </TermSection>

          <TermSection
            variants={itemVariants}
            icon={<FaShieldHalved />}
            title="2. Авторское право"
          >
            Мы уважаем интеллектуальную собственность. Если вы являетесь правообладателем и считаете, что ваши права нарушены, свяжитесь напрямую с хостинг-провайдером видео. В случае необходимости мы можем заблокировать отображение конкретного контента в нашем индексе.
          </TermSection>

          <TermSection
            variants={itemVariants}
            icon={<FaBan />}
            title="3. Правила поведения"
          >
            Запрещается: использование скриптов для парсинга данных, попытки нарушения работы серверов (DDoS), распространение вредоносного ПО или спама. Любая активность, направленная на дестабилизацию платформы, приведет к немедленной блокировке доступа по IP.
          </TermSection>

          <TermSection
            variants={itemVariants}
            icon={<FaGavel />}
            title="4. Ответственность"
          >
            Сервис предоставляется по принципу <strong>«как есть»</strong> (AS IS). Администрация не гарантирует бесперебойную работу сайта и не несет ответственности за любой ущерб, возникший в результате использования материалов, найденных через нашу систему.
          </TermSection>
        </div>
      </motion.div>
    </section>
  );
}

function TermSection({ icon, title, children, variants }: { icon: React.ReactNode; title: string; children: React.ReactNode; variants: any }) {
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
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaFileContract,
  FaGavel,
  FaCopyright,
  FaBan,
  FaExclamationTriangle,
  FaShieldAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';

export default function TermsPage() {
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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-brand/10 rounded-3xl mb-6 text-brand">
            <FaFileContract className="text-4xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white mb-6">
            Условия <span className="text-brand">использования</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Пожалуйста, внимательно ознакомьтесь с правилами использования платформы AniYume. Пользование сайтом означает ваше согласие с данными условиями.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <TermSection
            variants={itemVariants}
            icon={<FaCopyright />}
            title="1. Статус контента"
          >
            AniYume является <strong>индексатором</strong> (поисковой системой). Мы не храним видеофайлы на собственных серверах. Весь контент транслируется из открытых сторонних источников (Kodik, Anilibria). Мы не несем ответственности за содержание, доступность или качество внешних ресурсов.
          </TermSection>

          <TermSection
            variants={itemVariants}
            icon={<FaShieldAlt />}
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

        <motion.div
          variants={itemVariants}
          className="bg-brand/5 border border-brand/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <FaExclamationTriangle className="text-3xl text-brand mx-auto mb-4" />
          <h3 className="text-2xl font-bold dark:text-white mb-4 italic uppercase">Изменение условий</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
            Мы оставляем за собой право обновлять правила в любое время без уведомления. Последняя версия всегда доступна на этой странице.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://t.me/aniYume_group"
              target="_blank"
              className="flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 shadow-lg shadow-brand/20 transition-all active:scale-95"
            >
              Связаться с нами <FaExternalLinkAlt className="text-xs" />
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-2 border border-gray-200 dark:border-white/10 dark:text-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Конфиденциальность
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function TermSection({ icon, title, children, variants }: { icon: React.ReactNode; title: string; children: React.ReactNode; variants: any }) {
  return (
    <motion.div
      variants={variants}
      className="bg-gray-50 dark:bg-[#161616] p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-brand/30 transition-colors group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#1a1a1a] rounded-xl text-brand text-xl shadow-sm group-hover:bg-brand group-hover:text-white transition-all duration-300">
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

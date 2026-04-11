import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaFileContract,
  FaGavel,
  FaCopyright,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';

export const metadata = {
  title: 'Условия использования | Aniyume',
  description: 'Правила использования платформы Aniyume',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-200 flex flex-col items-center justify-center py-12 px-4 overflow-hidden relative transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand rounded-full blur-[130px] opacity-[0.04] dark:opacity-[0.07] -z-10 pointer-events-none" />

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
        <div className="space-y-8 order-2 lg:order-1">
          <TermCard icon={<FaCopyright />} title="1. Авторское право" align="right">
            <p>
              Aniyume — это поисковая система (индексатор). Мы{' '}
              <span className="font-bold text-gray-900 dark:text-gray-200">
                не храним
              </span>{' '}
              видеофайлы на своих серверах. Весь контент подгружается из открытых
              источников (Kodik).
            </p>
          </TermCard>

          <TermCard icon={<FaBan />} title="2. Правила поведения" align="right">
            <p>
              Запрещено использовать скрипты для автоматического сбора данных
              (парсинг) и пытаться нарушить работу сайта (DDoS). Мы оставляем за
              собой право заблокировать доступ нарушителям.
            </p>
          </TermCard>
        </div>

        <div className="flex flex-col items-center text-center order-1 lg:order-2 mb-10 lg:mb-0">
          <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] animate-float">
            <div className="absolute inset-0 bg-gray-100/10 to-transparent rounded-full blur-3xl transform scale-90 translate-y-6" />
            <Image
              src="/images/p44.png"
              alt="Terms Mascot"
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-8 tracking-tight text-gray-900 dark:text-gray-200 leading-tight">
            Условия <br />
            <span className="text-brand">Использования</span>
          </h1>

          <p className="text-gray-400 dark:text-gray-500 text-base mt-4 font-medium max-w-xs mx-auto">
            Правила просты: будьте вежливы и наслаждайтесь просмотром.
          </p>
        </div>

        <div className="space-y-8 order-3">
          <TermCard
            icon={<FaExclamationTriangle />}
            title="3. Отказ от ответственности"
            align="left"
          >
            <p>
              Администрация не несет ответственности за содержание
              видеоматериалов. Сайт предоставляется по принципу{' '}
              <span className="text-brand font-semibold">«как есть»</span>{' '}
              (AS IS). Мы не гарантируем аптайм 100%.
            </p>
          </TermCard>

          <TermCard icon={<FaGavel />} title="4. Изменения правил" align="left">
            <p>
              Мы можем обновлять условия использования в любой момент.
              Продолжая пользоваться сайтом, вы автоматически соглашаетесь с
              актуальной версией правил.
            </p>
          </TermCard>
        </div>
      </div>
    </div>
  );
}

interface TermCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  align: 'left' | 'right';
}

function TermCard({ icon, title, children, align }: TermCardProps) {
  const isRightAligned = align === 'right';

  return (
    <div
      className={`
        relative bg-white dark:bg-[#161616] border border-gray-100 dark:border-gray-800
        p-8 md:p-10
        rounded-3xl shadow-sm hover:shadow-2xl hover:border-brand/30 transition-all duration-300 group
        flex flex-col gap-5
        lg:items-${isRightAligned ? 'end' : 'start'}
        lg:text-${isRightAligned ? 'right' : 'left'}
        items-start text-left
      `}
    >
      <div
        className={`flex items-center gap-4 ${isRightAligned ? 'lg:flex-row-reverse' : 'lg:flex-row'
          } flex-row`}
      >
        <div className="p-4 rounded-2xl group-hover:bg-brand group-hover:text-white! transition-colors duration-300 shadow-sm flex items-center justify-center">
          <span className="text-2xl flex items-center justify-center">
            {icon}
          </span>
        </div>
        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-200">
          {title}
        </h3>
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}

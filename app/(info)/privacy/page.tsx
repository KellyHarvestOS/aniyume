import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserLock, FaDatabase, FaServer, FaFingerprint } from 'react-icons/fa';

export const metadata = {
  title: 'Конфиденциальность | Aniyume',
  description: 'Политика обработки данных платформы Aniyume',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-200 flex flex-col items-center justify-center py-12 px-4 overflow-hidden relative transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand rounded-full blur-[120px] opacity-[0.03] dark:opacity-[0.06] -z-10 pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
        <div className="space-y-6 order-2 lg:order-1">
          <PolicyCard icon={<FaUserLock />} title="1. Данные аккаунта" align="right">
            <p>
              Для входа мы храним <span className="font-bold text-gray-900 dark:text-gray-200">Логин</span> и{' '}
              <span className="font-bold text-gray-900 dark:text-gray-200">Пароль</span>. Пароли шифруются в{' '}
              <span className="text-brand font-semibold">Hash</span> — мы их не видим.
            </p>
          </PolicyCard>

          <PolicyCard icon={<FaDatabase />} title="2. Синхронизация" align="right">
            <p>
              Чтобы вы могли продолжить просмотр с другого устройства, мы храним списки
              («Смотрю», «В планах») и историю серий в базе данных.
            </p>
          </PolicyCard>
        </div>

        <div className="flex flex-col items-center text-center order-1 lg:order-2 mb-8 lg:mb-0">
          <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] animate-float">
            <div className="absolute inset-0 bg-linear-to-t from-[#21D0B8]/10 to-transparent rounded-full blur-2xl transform scale-90 translate-y-4" />
            <Image
              src="/images/s44.png"
              alt="Security Mascot"
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-6 tracking-tight text-gray-900 dark:text-gray-200 leading-tight">
            Политика <br />
            <span className="text-brand">Безопасности</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-3 font-medium max-w-xs mx-auto">
            Ваши данные под защитой. <br />
            Честно и прозрачно.
          </p>
        </div>

        <div className="space-y-6 order-3">
          <PolicyCard icon={<FaFingerprint />} title="3. Анонимность" align="left">
            <p>
              Никаких ФИО и телефонов. Ваш профиль — это только никнейм. Мы уважаем ваше
              право оставаться инкогнито.
            </p>
          </PolicyCard>

          <PolicyCard icon={<FaServer />} title="4. Источники" align="left">
            <p>
              Видео загружается напрямую через публичные API (Kodik, Shikimori). Мы
              предоставляем только удобный интерфейс.
            </p>
          </PolicyCard>
        </div>
      </div>

      <div className="mt-16 relative z-10">
        <Link
          href="https://t.me/kellyharvest"
          target="_blank"
          className="group relative inline-flex items-center gap-3 px-8 py-3 bg-white dark:bg-[#161616] text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-full font-bold shadow-lg hover:shadow-[#21D0B8]/20 hover:border-[#21D0B8] hover:text-[#21D0B8] transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Связаться с разработчиком</span>
          <div className="absolute inset-0 bg-[#21D0B8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

interface PolicyCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  align: 'left' | 'right';
}

function PolicyCard({ icon, title, children, align }: PolicyCardProps) {
  const isRightAligned = align === 'right';

  return (
    <div
      className={`
        relative bg-white dark:bg-[#161616] border border-gray-100 dark:border-gray-800 p-10 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#21D0B8]/30 transition-all duration-300 group
        flex flex-col gap-3
        lg:items-${isRightAligned ? 'end' : 'start'} 
        lg:text-${isRightAligned ? 'right' : 'left'}
        items-start text-left
      `}
    >
      <div
        className={`flex items-center gap-3 ${
          isRightAligned ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } flex-row`}
      >
        <div className="p-3 rounded-xl bg-[#21D0B8]/10 text-[#21D0B8] group-hover:bg-[#21D0B8] group-hover:text-white transition-colors duration-300">
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}

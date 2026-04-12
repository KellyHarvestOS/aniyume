'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BiWifi, BiMobile, BiHdd, BiDownload, BiWorld, BiCalendar,
  BiUser, BiLock, BiCaptions, BiTv, BiTrash, BiShield,
  BiLogoChrome, BiGlobe, BiBug, BiPlay, BiRename,
  BiMessageRounded, BiPlus, BiMinus
} from 'react-icons/bi';
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#111111] text-gray-900 dark:text-gray-200 pt-10 pb-20 px-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px]  rounded-full blur-[160px] pointer-events-none" />

      <h1 className="text-4xl md:text-6xl text-center mb-6 relative z-10 font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
        Центр <span className="text-brand w-[30rem]">Поддержки</span>
      </h1>

      <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 text-center italic">
        Мы подготовили ответы на самые популярные вопросы, чтобы помочь вам разобраться с функционалом AniYume.
      </p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
        {faqData.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleQuestion(index)}
            className={`
              group rounded-[1rem] overflow-hidden cursor-pointer transition-all duration-500
              bg-white dark:bg-[#161616] border shadow-sm
              ${openIndex === index
                ? 'border-brand-simple shadow-brand-soft ring-4 ring-brand/5'
                : 'border-gray-100 dark:border-white/5 hover:border-brand-dim hover:shadow-md'
              }
            `}
          >
            <div className="p-6 md:p-8 flex items-start gap-6">
              <div
                className={`
                  p-4 rounded-2xl transition-all duration-500 shrink-0 flex items-center justify-center
                  ${openIndex === index
                    ? 'bg-brand text-white'
                    : 'bg-brand text-white group-hover:bg-brand group-hover:text-white'
                  }
                `}
              >
                <span className="text-2xl flex items-center justify-center">
                  {item.icon}
                </span>
              </div>

              <div className="flex-1 pt-1">
                <div className="flex justify-between items-center w-full">
                  <h3 className={`text-lg font-black uppercase italic tracking-tight transition-colors duration-300 ${openIndex === index ? 'text-brand' : 'text-gray-800 dark:text-gray-200 group-hover:text-brand'
                    }`}>
                    {item.question}
                  </h3>
                  <div
                    className={`shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${openIndex === index
                      ? 'bg-brand text-white border-transparent rotate-180'
                      : 'border-gray-200 dark:border-white/10 text-gray-400'
                      }`}
                  >
                    {openIndex === index ? <BiMinus size={16} /> : <BiPlus size={16} />}
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${openIndex === index
                    ? 'grid-rows-[1fr] opacity-100 mt-5'
                    : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed font-bold border-l-4 border-brand-dim pl-4 py-1">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center relative z-10 hover^text-white!">
        <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">
          Не нашли нужный ответ?
        </p>
        <Link
          href="https://t.me/kellyharvest"
          className="inline-flex items-center gap-3 text-brand font-black uppercase italic tracking-widest text-lg transition-all bg-brand/5 px-10 py-5 rounded-2xl border border-brand-dim hover:bg-brand hover:text-white shadow-lg hover:shadow-brand/30 active:scale-95"
        >
          Написать в поддержку
        </Link>
      </div>
    </div>
  );
}

const faqData = [
  { icon: <BiWifi />, question: "Видео постоянно тормозит, что делать?", answer: "Попробуйте снизить качество видео или проверить интернет-соединение." },
  { icon: <BiMobile />, question: "Есть ли мобильное приложение?", answer: "Можно установить сайт как PWA через браузер." },
  { icon: <BiHdd />, question: "Как включить 1080p или 4K?", answer: "Выберите максимальное доступное качество в настройках плеера." },
  { icon: <BiCalendar />, question: "Когда выходят новые серии?", answer: "Обычно через 1-2 дня после релиза." },
  { icon: <BiUser />, question: "Как синхронизировать просмотр?", answer: "Войдите в аккаунт — данные синхронизируются автоматически." },
  { icon: <BiLock />, question: "Забыл пароль, что делать?", answer: "Напишите в поддержку для сброса доступа." },
  { icon: <BiCaptions />, question: "Есть ли субтитры?", answer: "Да, у большинства популярных тайтлов." },
  { icon: <BiTrash />, question: "Как удалить аккаунт?", answer: "Удаление доступно в настройках профиля." },
  { icon: <FaWandMagicSparkles />, question: "Как работает умный поиск?", answer: "Поиск учитывает альтернативные названия." },
  { icon: <BiLogoChrome />, question: "Какой браузер лучше?", answer: "Chrome, Firefox или Safari последних версий." },
  { icon: <BiBug />, question: "Нашел баг, куда писать?", answer: "Напишите в поддержку с описанием проблемы." },
  { icon: <BiPlay />, question: "Файл не найден в плеере", answer: "Попробуйте выбрать другую озвучку." },
];

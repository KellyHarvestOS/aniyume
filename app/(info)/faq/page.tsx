'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BiWifi,
  BiMobile,
  BiHdd,
  BiDownload,
  BiWorld,
  BiCalendar,
  BiUser,
  BiLock,
  BiCaptions,
  BiTv,
  BiTrash,
  BiShield,
  BiLogoChrome,
  BiUserVoice,
  BiGlobe,
  BiBug,
  BiPlay,
  BiRename,
  BiMessageRounded,
  BiPlus,
  BiMinus
} from 'react-icons/bi';
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] dark:bg-[#111111] text-gray-900 dark:text-gray-200 pt-10 pb-20 px-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#21D0B8] rounded-full blur-[160px] opacity-[0.04] dark:opacity-[0.07] pointer-events-none" />

      <h1 className="text-4xl md:text-6xl text-center mb-6 relative z-10 font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
        Центр <span className="text-[#21D0B8]">Поддержки</span>
      </h1>

      <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 text-center">
        Мы подготовили ответы на самые популярные вопросы, чтобы помочь вам разобраться с функционалом платформы.
      </p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
        {faqData.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleQuestion(index)}
            className={`
              group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
              bg-white dark:bg-[#161616] border
              ${openIndex === index
                ? 'border-[#21D0B8] shadow-[0_8px_30px_rgba(33,208,184,0.18)] ring-1 ring-[#21D0B8]'
                : 'border-gray-100 dark:border-gray-800 hover:border-[#21D0B8]/40 shadow-sm hover:shadow-md'
              }
            `}
          >
            <div className="p-6 flex items-start gap-5">
              <div
                className={`
                  mt-1 p-3.5 rounded-xl transition-colors duration-300 shrink-0
                  ${openIndex === index
                    ? 'bg-[#21D0B8] text-white'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] text-[#21D0B8] group-hover:bg-[#21D0B8]/10'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-bold pr-4 text-gray-800 dark:text-gray-200">
                    {item.question}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${
                      openIndex === index
                        ? 'rotate-180 text-[#21D0B8]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    {openIndex === index ? <BiMinus size={14} /> : <BiPlus size={14} />}
                  </span>
                </div>

                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                    openIndex === index
                      ? 'grid-rows-[1fr] opacity-100 mt-3'
                      : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium">
                      {item.answer}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="text-gray-400 dark:text-gray-500 font-medium mb-4">
          Не нашли нужный ответ?
        </p>
        <Link
          href="https://t.me/kellyharvest"
          className="inline-flex items-center gap-2 text-[#21D0B8] font-bold hover:text-[#1aa895] text-lg transition-colors bg-[#21D0B8]/5 px-6 py-2 rounded-full hover:bg-[#21D0B8]/10"
        >
          <BiMessageRounded /> Написать в поддержку
        </Link>
      </div>
    </div>
  );
}

const faqData = [
  { icon: <BiWifi />, question: "Видео постоянно тормозит, что делать?", answer: "Попробуйте снизить качество видео или проверить интернет-соединение." },
  { icon: <BiMobile />, question: "Есть ли мобильное приложение?", answer: "Можно установить сайт как PWA через браузер." },
  { icon: <BiHdd />, question: "Как включить 1080p или 4K?", answer: "Выберите максимальное доступное качество в настройках плеера." },
  { icon: <BiDownload />, question: "Можно ли скачивать серии?", answer: "Скачивание недоступно из-за ограничений правообладателей." },
  { icon: <BiWorld />, question: "Как сменить озвучку?", answer: "Используйте выпадающий список «Озвучка» в плеере." },
  { icon: <BiCalendar />, question: "Когда выходят новые серии?", answer: "Обычно через 30–60 минут после релиза." },
  { icon: <BiUser />, question: "Как синхронизировать просмотр?", answer: "Войдите в аккаунт — данные синхронизируются автоматически." },
  { icon: <BiLock />, question: "Забыл пароль, что делать?", answer: "Напишите в поддержку для сброса доступа." },
  { icon: <BiCaptions />, question: "Есть ли субтитры?", answer: "Да, у большинства популярных тайтлов." },
  { icon: <BiTrash />, question: "Как удалить аккаунт?", answer: "Удаление доступно в настройках профиля." },
  { icon: <FaWandMagicSparkles />, question: "Как работает умный поиск?", answer: "Поиск учитывает альтернативные названия." },
  { icon: <BiShield />, question: "Это легально?", answer: "Сайт не хранит видео и использует открытые источники." },
  { icon: <BiLogoChrome />, question: "Какой браузер лучше?", answer: "Chrome, Firefox или Safari последних версий." },
  { icon: <BiGlobe />, question: "Нужен ли VPN?", answer: "Обычно нет, но иногда помогает." },
  { icon: <BiBug />, question: "Нашел баг, куда писать?", answer: "Напишите в поддержку с описанием проблемы." },
  { icon: <BiPlay />, question: "Файл не найден в плеере", answer: "Попробуйте выбрать другую озвучку." },
  { icon: <BiRename />, question: "Можно ли сменить ник?", answer: "Пока недоступно напрямую." },
  { icon: <BiMessageRounded />, question: "Как предложить идею?", answer: "Напишите нам в Telegram или Discord." }
];

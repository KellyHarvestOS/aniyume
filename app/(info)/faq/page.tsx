'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BiWifi, BiMobile, BiHdd, BiDownload, BiWorld, BiCalendar,
  BiUser, BiLock, BiCaptions, BiTv, BiTrash, BiShield,
  BiLogoChrome, BiGlobe, BiBug, BiPlay, BiRename,
  BiMessageRounded, BiPlus, BiMinus, BiQuestionMark
} from 'react-icons/bi';
import { FaWandMagicSparkles, FaTelegram } from "react-icons/fa6";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] text-gray-900 dark:text-gray-200 py-16 px-4 md:px-8 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 rounded-3xl mb-8 text-brand shadow-lg shadow-brand/5"
          >
            <BiQuestionMark className="text-5xl" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6"
          >
            База <span className="text-brand">знаний</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic"
          >
            Ответы на самые частые вопросы о работе платформы AniYume.
          </motion.p>
        </div>

        <div className="space-y-4 relative z-10">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                group rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500
                ${openIndex === index
                  ? 'bg-white dark:bg-[#1A1A1A] border-[#00E2C4] shadow-2xl'
                  : 'bg-gray-50 dark:bg-[#141414] border-transparent hover:border-[#00E2C4]/30'
                }
                border-2
              `}
              onClick={() => toggleQuestion(index)}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-8">
                  <div
                    className={`
                      w-12 h-12 md:w-16 md:h-16 rounded-2xl shrink-0 flex items-center justify-center transition-all duration-500
                      ${openIndex === index
                        ? 'bg-[#00E2C4] text-white shadow-lg'
                        : 'bg-white dark:bg-[#222] text-gray-400 group-hover:text-[#00E2C4]'
                      }
                    `}
                  >
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center w-full">
                      <h3 className={`text-lg md:text-2xl font-black transition-colors duration-300 ${openIndex === index ? 'text-[#00E2C4]' : 'text-slate-900 dark:text-gray-100 group-hover:text-[#00E2C4]'
                        }`}>
                        {item.question}
                      </h3>
                      <div
                        className={`shrink-0 ml-4 w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${openIndex === index
                          ? 'bg-[#00E2C4] text-white border-transparent rotate-180'
                          : 'border-slate-200 dark:border-white/10 text-slate-300'
                          }`}
                      >
                        {openIndex === index ? <BiMinus size={24} /> : <BiPlus size={24} />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                            <div className="bg-slate-50 dark:bg-white/[0.03] p-6 rounded-2xl border-l-4 border-[#00E2C4]">
                              <p className="text-slate-800 dark:text-white text-base md:text-xl font-bold leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-10 bg-brand/5 border border-brand/20 rounded-[3rem] text-center relative z-10"
        >
          <p className="text-brand font-black uppercase tracking-[0.2em] text-sm mb-4">
            Есть другие вопросы?
          </p>
          <h2 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white mb-8">
            Напишите в нашу поддержку
          </h2>
          <Link
            href="https://t.me/kellyharvest"
            target="_blank"
            className="inline-flex items-center gap-3 bg-brand text-white font-black uppercase italic tracking-widest text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-brand/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <FaTelegram className="text-2xl" /> Telegram Channel
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const faqData = [
  {
    icon: <BiWifi />,
    question: "Видео тормозит или не грузится",
    answer: "Попробуйте переключить качество в плеере (например, с 1080p на 720p). Также проверьте, не включен ли VPN — некоторые провайдеры видео могут ограничивать доступ к серверам раздачи."
  },
  {
    icon: <BiPlay />,
    question: "Файл не найден или ошибка плеера",
    answer: "Это бывает, когда источник (Kodik/Anilibria) обновляет свои ссылки. Просто обновите страницу или попробуйте выбрать другую озвучку в списке плеера."
  },
  {
    icon: <BiMobile />,
    question: "Есть ли приложение для Android/iOS?",
    answer: "AniYume — это прогрессивное веб-приложение (PWA). Вы можете добавить сайт на главный экран через меню настроек вашего браузера (кнопка «Добавить на главный экран»), и он будет работать как обычное приложение."
  },
  {
    icon: <BiUser />,
    question: "Как сохранить прогресс просмотра?",
    answer: "Для этого нужно быть авторизованным. Платформа запоминает серию и точное время, на котором вы остановились, и синхронизирует это между всеми вашими устройствами."
  },
  {
    icon: <BiShield />,
    question: "Безопасно ли регистрироваться?",
    answer: "Мы не запрашиваем лишних данных (телефон, ФИО). Все пароли шифруются по стандарту bcrypt, так что даже мы не знаем ваш пароль в открытом виде."
  },
  {
    icon: <BiCalendar />,
    question: "Когда выходят новые серии?",
    answer: "Обычно эпизод появляется через 1-2 часа после выхода в Японии с субтитрами, и через 12-24 часа с популярными озвучками. Следите за разделом «Расписание»."
  },
  {
    icon: <BiTrash />,
    question: "Как удалить свои данные?",
    answer: "Вы можете запросить удаление аккаунта через настройки профиля или написав в нашу поддержку в Telegram. Все данные будут стерты безвозвратно."
  },
  {
    icon: <FaWandMagicSparkles />,
    question: "Умный поиск не находит аниме",
    answer: "Система поиска поддерживает названия на русском, английском и японском (ромадзи). Если ничего не находится, попробуйте сократить запрос или проверить правильность написания."
  },
];

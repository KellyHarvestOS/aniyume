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
import { useI18n } from '@/contexts/I18nContext';

export default function FAQPage() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] dark:bg-[#111111] text-gray-900 dark:text-gray-200 pt-10 pb-20 px-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#21D0B8] rounded-full blur-[160px] opacity-[0.04] dark:opacity-[0.07] pointer-events-none" />

      <h1 className="text-4xl md:text-6xl text-center mb-6 relative z-10 font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
        {t('faq.title1')} <span className="text-brand">{t('faq.title2')}</span>
      </h1>

      <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 text-center">
        {t('faq.subtitle')}
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
                ? 'border-brand shadow-[0_8px_30px_rgba(33,208,184,0.18)] ring-1 ring-brand'
                : 'border-gray-100 dark:border-gray-800 hover:border-brand/40 shadow-sm hover:shadow-md'
              }
            `}
          >
            <div className="p-6 flex items-start gap-5">
              <div
                className={`
                  mt-1 p-3.5 rounded-xl transition-colors duration-300 shrink-0
                  ${openIndex === index
                    ? 'bg-brand text-white'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] text-brand group-hover:bg-brand/10'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-bold pr-4 text-gray-800 dark:text-gray-200">
                    {t(item.questionKey)}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${openIndex === index
                        ? 'rotate-180 text-brand'
                        : 'text-gray-300 dark:text-gray-600'
                      }`}
                  >
                    {openIndex === index ? <BiMinus size={14} /> : <BiPlus size={14} />}
                  </span>
                </div>

                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${openIndex === index
                      ? 'grid-rows-[1fr] opacity-100 mt-3'
                      : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium">
                      {t(item.answerKey)}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <Link
          href="https://t.me/aniYume_group"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand/80 text-lg transition-colors bg-black/10 px-6 py-2 rounded-xl hover:bg-black/20"
        >
          <BiMessageRounded /> {t('faq.telegram')}
        </Link>
      </div>
    </div>
  );
}

const faqData = [
  { icon: <BiWifi />, questionKey: "faq.q1", answerKey: "faq.a1" },
  { icon: <BiMobile />, questionKey: "faq.q2", answerKey: "faq.a2" },
  { icon: <BiDownload />, questionKey: "faq.q3", answerKey: "faq.a3" },
  { icon: <BiCalendar />, questionKey: "faq.q4", answerKey: "faq.a4" },
  { icon: <BiUser />, questionKey: "faq.q5", answerKey: "faq.a5" },
  { icon: <BiLock />, questionKey: "faq.q6", answerKey: "faq.a6" },
  { icon: <BiTrash />, questionKey: "faq.q7", answerKey: "faq.a7" },
  { icon: <FaWandMagicSparkles />, questionKey: "faq.q8", answerKey: "faq.a8" },
  { icon: <BiLogoChrome />, questionKey: "faq.q9", answerKey: "faq.a9" },
  { icon: <BiGlobe />, questionKey: "faq.q10", answerKey: "faq.a10" },
  { icon: <BiBug />, questionKey: "faq.q11", answerKey: "faq.a11" },
  { icon: <BiMessageRounded />, questionKey: "faq.q12", answerKey: "faq.a12" }
];

'use client';

import React from 'react';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center justify-start px-4 md:px-6 pt-10 md:pt-16 overflow-hidden relative">

            <style jsx>{`
                .lava-error {
                    filter: url('#goo-error');
                    position: absolute;
                    inset: 0;
                    background: #21D0B8;
                }
                .blob-error {
                    position: absolute;
                    background: #00F2FE;
                    border-radius: 50%;
                    filter: blur(15px);
                    width: 60px;
                    height: 60px;
                    animation: move-error 10s infinite alternate ease-in-out;
                }
                @keyframes move-error {
                    0% { transform: translate(-20%, -20%) scale(1); }
                    100% { transform: translate(120%, 80%) scale(1.5); }
                }
            `}</style>

            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="goo-error">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                            result="goo" />
                    </filter>
                </defs>
            </svg>

            <div className="relative w-full max-w-[600px] aspect-16/10 mb-4 md:mb-6">
                <Image
                    src="/images/404.png"
                    alt="404 Light"
                    fill
                    className="object-contain dark:hidden"
                    priority
                />
                <Image
                    src="/images/404_dark_.png"
                    alt="404 Dark"
                    fill
                    className="hidden dark:block object-contain"
                    priority
                />
            </div>

            <div className="text-center relative z-10 px-2">
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white leading-none mb-3">
                    Упс... <span className="text-[#39bcba]">Ошибка</span>
                </h1>

                <p className="text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs md:text-sm mb-10 md:mb-16 italic">
                    Похоже, эта страница ушла в другой мир
                </p>
            </div>


        </div>
    );
}
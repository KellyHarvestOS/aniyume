'use client';

import React from 'react';

export function RoomInfo({ roomId }: { roomId: string }) {
    return (
        <section className="w-full min-w-0 col-span-1 lg:col-span-1 lg:col-start-1 lg:row-start-2">
            <div className="w-full min-w-0 rounded-4xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-8 py-8 shadow-sm">
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-[#0b1f44] dark:text-white">
                    КОМНАТА #{roomId}
                </h2>

                <p className="mt-4 block w-full text-lg font-bold text-brand ">
                    • Ожидание начала трансляции...
                </p>
            </div>
        </section>
    );
}
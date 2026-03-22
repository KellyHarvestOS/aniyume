'use client';

import React from 'react';
import { FaPlay } from 'react-icons/fa';

export function VideoPlayer({ roomId }: { roomId: string }) {
    return (
        <section className="min-w-0">
            <div className="aspect-video w-full rounded-4xl bg-black flex items-center justify-center overflow-hidden shadow-sm">
                <button className="w-24 h-24 rounded-full border border-[#21D0B8]/40 bg-[#21D0B8]/10 flex items-center justify-center">
                    <FaPlay className="text-[#21D0B8] text-4xl ml-1" />
                </button>
            </div>
        </section>
    );
}
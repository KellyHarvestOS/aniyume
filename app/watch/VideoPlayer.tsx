'use client';

import React from 'react';
import { FaPlay } from 'react-icons/fa';

export function VideoPlayer({ roomId }: { roomId: string }) {
    return (
        <section className="min-w-0">
            <div className="aspect-video w-full rounded-4xl bg-black flex items-center justify-center overflow-hidden shadow-sm">
                <button className="w-24 h-24 rounded-full border border-brand bg-black flex items-center justify-center">
                    <FaPlay className="text-brand text-4xl ml-1" />
                </button>
            </div>
        </section>
    );
}
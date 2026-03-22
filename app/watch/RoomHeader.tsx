import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCopy, FaSignOutAlt } from 'react-icons/fa';
import ThemeToggle from '@/components/layout/ThemeToggle';

interface HeaderProps {
    roomId: string;
    onCopy: () => void;
    copied: boolean;
    onExit: () => void;
}

export const RoomHeader = ({ roomId, onCopy, copied, onExit }: HeaderProps) => {
    return (
        <header className="h-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/" onClick={onExit} className="shrink-0 transition-opacity hover:opacity-80">
                    <Image
                        src="/images/logo0.png"
                        alt="AniYume"
                        width={80}
                        height={40}
                        className="h-8 sm:h-14 w-auto dark:hidden"
                    />
                    <Image
                        src="/images/logo01.png"
                        alt="AniYume"
                        width={80}
                        height={40}
                        className="h-8 sm:h-14 w-auto hidden dark:block"
                    />
                </Link>

                <div className="scale-90 sm:scale-100">
                    <ThemeToggle />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 dark:bg-white/5 px-2.5 sm:px-4 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 transition-all">
                    <span className="hidden md:inline text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                        Room:
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#21D0B8] tracking-wider tabular-nums">
                        {roomId}
                    </span>
                    <button
                        onClick={onCopy}
                        className={`ml-1 sm:ml-2 p-1 transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {copied ? <span className="text-[10px] font-black">OK!</span> : <FaCopy size={12} />}
                    </button>
                </div>

                <button
                    onClick={onExit}
                    className="p-2 sm:p-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors flex items-center gap-2"
                >
                    <span className="hidden sm:inline text-xs font-black uppercase italic tracking-tighter">
                        Выйти
                    </span>
                    <FaSignOutAlt size={16} />
                </button>
            </div>
        </header>
    );
};
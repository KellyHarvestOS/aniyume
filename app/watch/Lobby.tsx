import React from 'react';
import Image from 'next/image';
import { FaPlus, FaHashtag, FaDoorOpen, FaUsers, FaArrowLeft } from 'react-icons/fa';



interface LobbyProps {
    onCreate: () => void;
    onJoin: (e: React.FormEvent) => void;
    inputCode: string;
    onBack: () => void;
    setInputCode: (val: string) => void;
}

export const Lobby = ({ onCreate, onJoin, onBack, inputCode, setInputCode }: LobbyProps) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center p-4 md:p-8 transition-colors overflow-hidden relative">

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#21D0B8] opacity-10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 opacity-10 blur-[120px] rounded-full" />

            <div className="max-w-5xl w-full bg-white/70 dark:bg-[#0f0f0f]/80 backdrop-blur-2xl rounded-4xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch transition-all">

                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-20 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-[#21D0B8] hover:border-[#21D0B8] transition-all active:scale-95 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="md:w-1/2 p-12 bg-linear-to-br from-[#21D0B8]/10 to-transparent flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5">
                    <div className="mb-8">
                        <Image
                            src="/images/logo0.png"
                            alt="AniYume"
                            width={180}
                            height={100}
                            className="dark:hidden h-25 w-auto"
                        />
                        <Image
                            src="/images/logo01.png"
                            alt="AniYume"
                            width={180}
                            height={100}
                            className="hidden dark:block h-25 w-auto"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 uppercase tracking-tighter">
                        Смотрите <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#21cdd0] to-[#10a8a0]">
                            вместе
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-sm mb-8">
                        Синхронный просмотр видео с друзьями. Создайте свою комнату за секунду.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <span className="flex items-center gap-2"> <FaUsers /> 2,400+ онлайн</span>
                    </div>
                </div>

                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/30 dark:bg-black/20">
                    <div className="space-y-6">

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Начать сессию</p>
                            <button
                                onClick={onCreate}
                                className="group relative w-full flex items-center justify-between gap-3 bg-[#21D0B8] hover:bg-[#1bb8a3] text-white py-5 px-8 rounded-2xl font-bold transition-all"
                            >
                                <span className="flex items-center gap-3">
                                    <FaPlus className="text-lg" />
                                    Создать новую комнату
                                </span>
                                <div className="bg-white/20 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                                </div>
                            </button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                                <span className="bg-transparent px-4 text-gray-400">ИЛИ</span>
                            </div>
                        </div>

                        <form onSubmit={onJoin} className="space-y-4">
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Уже есть код?</p>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#21D0B8] transition-colors">
                                        <FaHashtag />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Введите код комнаты..."
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value)}
                                        className="w-full bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-5 pl-12 pr-4 text-gray-900 dark:text-white focus:border-[#21D0B8] focus:ring-4 focus:ring-[#21D0B8]/10 outline-none transition-all placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 border-2 border-gray-200 dark:border-white/10 hover:border-[#21D0B8] hover:bg-[#21D0B8]/5 text-gray-700 dark:text-gray-300 hover:text-[#21D0B8] rounded-2xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <FaDoorOpen className="text-lg" />
                                Войти по коду
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Нажимая «Создать», вы соглашаетесь с правилами сервиса
                    </p>
                </div>
            </div>
        </div>
    );
};
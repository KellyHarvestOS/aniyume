'use client';

import React, { useState } from 'react';
import { FaInfoCircle, FaPaperPlane } from 'react-icons/fa';

export const ChatSidebar = ({ roomId }: { roomId: string }) => {
    const [activeTab, setActiveTab] = useState('chat');

    return (
        <div className="w-full lg:w-[380px]">
            <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden h-[500px]">
                <div className="p-2 flex gap-1 bg-gray-50 dark:bg-[#0d0d0d] m-4 rounded-2xl border border-gray-100 dark:border-gray-800 shrink-0">
                    {['chat', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-white dark:bg-[#1a1a1a] text-[#21D0B8] shadow-sm'
                                : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
                                }`}
                        >
                            {tab === 'chat' ? 'Чат' : 'Настройки'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 px-4 space-y-4 overflow-y-auto no-scrollbar custom-scrollbar">
                    {activeTab === 'chat' ? (
                        <>
                            <div className="bg-[#21D0B8]/5 border border-[#21D0B8]/10 rounded-2xl p-4 flex gap-3 mt-2">
                                <FaInfoCircle className="text-[#21D0B8] shrink-0 mt-1" />
                                <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed font-bold italic">
                                    Код для друзей: <span className="text-[#21D0B8] select-all">{roomId}</span>
                                </p>
                            </div>

                            <div className="space-y-4 pb-4">
                                <div className="text-center py-20 text-gray-300 dark:text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Начало истории
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-gray-400 text-[10px] font-black uppercase italic tracking-widest">
                            Настройки временно недоступны
                        </div>
                    )}
                </div>

                {activeTab === 'chat' && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0d0d0d] shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="НАПИСАТЬ СООБЩЕНИЕ..."
                                className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-xs font-bold uppercase italic tracking-wider focus:border-[#21D0B8] outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-white/5"
                            />
                            <button className="bg-[#21D0B8] p-3.5 rounded-xl text-white dark:text-[#0d0d0d] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#21D0B8]/20">
                                <FaPaperPlane size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .no-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .no-scrollbar::-webkit-scrollbar-thumb {
                    background: #21D0B8;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
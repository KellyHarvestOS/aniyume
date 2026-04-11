'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { IoClose, IoSend } from 'react-icons/io5';
import { PiSoundcloudLogoFill } from "react-icons/pi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatModal({ onClose }: { onClose: () => void }) {
    const controls = useAnimation();
    const modalRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Доброе утро";
        if (hour >= 12 && hour < 18) return "Добрый день";
        if (hour >= 18 && hour < 23) return "Добрый вечер";
        return "Доброй ночи";
    };

    useEffect(() => {
        setMessages([{
            role: 'assistant',
            content: `${getGreeting()}! Я твой личный помощник AniYume. Чем я могу скрасить твоё время?`
        }]);

        controls.start({ x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }, [controls]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await response.json();
            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Извини, произошла ошибка связи с сервером. 😭" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: any, info: PanInfo) => {
        const windowWidth = window.innerWidth;
        const modalWidth = modalRef.current?.offsetWidth || 380;
        if (info.point.x < windowWidth / 2) {
            controls.start({ x: -(windowWidth - modalWidth - 48), transition: { type: 'spring', stiffness: 250, damping: 25 } });
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } });
        }
    };

    return (
        <motion.div
            ref={modalRef} drag="x" dragMomentum={false} onDragEnd={handleDragEnd}
            initial={{ x: 100, opacity: 0, scale: 0.95 }}
            animate={controls} exit={{ x: 100, opacity: 0, scale: 0.95 }}
            className="fixed bottom-24 z-110 w-[320px] sm:w-[360px] h-[520px] flex flex-col overflow-hidden bg-white dark:bg-[#0f0f0f] border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-xl right-6"
        >
            <div className="bg-brand p-4 flex items-center justify-between cursor-grab active:cursor-grabbing shadow-md">
                <div className="flex items-center gap-3 text-white">
                    <PiSoundcloudLogoFill className="text-2xl" />
                    <div>
                        <h3 className="font-bold text-sm leading-none">AniYume Support</h3>
                        <span className="text-[10px] opacity-80 uppercase font-medium">AI Online</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-white hover:bg-white/10 p-1.5 rounded-lg"><IoClose size={22} /></button>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc] dark:bg-[#0d0d0d] custom-scrollbar">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                            ? 'bg-brand text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/5 rounded-tl-none'
                            }`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    strong: ({ node, ...props }) => <strong className="font-black text-brand dark:text-brand" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-2" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 my-2" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-brand underline hover:no-underline" target="_blank" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm">
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-[#0f0f0f] border-t border-slate-200 dark:border-white/5">
                {!isLoading && messages.length < 3 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {['Расписание', 'Проблемы с плеером', 'Помощь'].map((text) => (
                            <button
                                key={text}
                                onClick={() => handleSend(text)}
                                className="text-[11px] font-bold py-1 px-3 rounded-lg bg-slate-100 dark:bg-white/5 text-brand hover:bg-brand hover:text-white transition-all"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                    className="relative flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-xl border border-transparent focus-within:border-brand/50 transition-all shadow-inner"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Задайте вопрос..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-200"
                    />
                    <button
                        type="submit"
                        className="bg-brand text-white p-2.5 rounded-lg shadow-lg hover:shadow-brand/50 transition-all"
                    >
                        <IoSend size={16} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
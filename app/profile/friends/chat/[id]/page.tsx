'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
    FaArrowLeft, FaPaperPlane, FaImage, FaSmile,
    FaEllipsisV, FaFileAlt
} from 'react-icons/fa';
import { MdGif } from 'react-icons/md';


interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    gifUrl?: string;
    senderId: number;
    timestamp: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const friendId = Number(params.id);


    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Привет! Го в пати?', senderId: friendId, timestamp: new Date(Date.now() - 3600000) },
        { id: '2', text: 'Залетаю через 5 минут ', senderId: 0, timestamp: new Date(Date.now() - 3500000) }, // 0 = мы
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: message,
            senderId: 0,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMsg]);
        setMessage('');
    };

    const handleAttachPhoto = () => {
        alert('Открытие выбора фото...');
    };

    const handleOpenGifMenu = () => {
        alert('Открытие меню GIF...');
    };

    const handleOpenEmoji = () => {
        alert('Открытие выбора эмодзи...');
    };

    return (
        <div className="h-screen max-h-screen bg-white dark:bg-[#111111] transition-colors overflow-hidden relative flex flex-col">
            <style jsx>{`
                .custom-glass {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .dark .custom-glass {
                    background: rgba(20, 20, 20, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                }
                /* Скрываем стандартный скроллбар для красоты */
                .no-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .no-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .no-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--brand-main-rgb, 33, 208, 184), 0.3);
                    border-radius: 10px;
                }
            `}</style>

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 custom-glass border-b border-white/5 shrink-0">
                <div className="container mx-auto px-4 md:px-20 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/friends')}
                            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand transition-colors group shadow-inner"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friendId}`}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full border-2 border-brand/50 object-cover bg-gray-800"
                                />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand border-2 border-[#111111] rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white leading-none">
                                    NICKNAME_{friendId}
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mt-1">
                                    В сети
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="text-gray-500 hover:text-brand p-3 transition-colors">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar container mx-auto px-4 md:px-20 py-8 flex flex-col gap-6">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === 0;
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}
                        >
                            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`
                                    px-5 py-3 rounded-2xl relative
                                    ${isMe
                                        ? 'bg-brand text-white dark:text-black rounded-br-sm shadow-[0_0_15px_rgba(var(--brand-main-rgb,33_208_184)/0.2)]'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-white/5'}
                                `}>
                                    {msg.text && (
                                        <p className="text-sm font-medium leading-relaxed">
                                            {msg.text}
                                        </p>
                                    )}
                                </div>
                                <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-200 dark:border-white/5 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-75" />
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="relative z-20 pb-6 pt-2 shrink-0">
                <div className="container mx-auto px-4 md:px-20">
                    <form
                        onSubmit={handleSendMessage}
                        className="custom-glass rounded-2xl p-2 flex items-end gap-2 border-2 border-transparent focus-within:border-brand/30 transition-all"
                    >
                        <div className="flex gap-1 pb-1 pl-1">
                            <button
                                type="button"
                                onClick={handleAttachPhoto}
                                className="w-10 h-10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-brand flex items-center justify-center transition-all"
                                title="Прикрепить фото"
                            >
                                <FaImage size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenGifMenu}
                                className="w-10 h-10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-brand flex items-center justify-center transition-all"
                                title="Отправить GIF"
                            >
                                <MdGif size={28} />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Написать сообщение..."
                                className="w-full bg-transparent resize-none outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-500 py-3 px-2 max-h-32 min-h-[44px]"
                                rows={1}
                            />
                        </div>

                        <div className="flex gap-2 pb-1 pr-1">
                            <button
                                type="button"
                                onClick={handleOpenEmoji}
                                className="w-10 h-10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-brand flex items-center justify-center transition-all"
                                title="Эмодзи"
                            >
                                <FaSmile size={18} />
                            </button>

                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-12 h-12 bg-brand text-white dark:text-black rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:brightness-110 shadow-lg shadow-brand/20"
                            >
                                <FaPaperPlane size={16} className="ml-[-2px] mt-[2px]" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
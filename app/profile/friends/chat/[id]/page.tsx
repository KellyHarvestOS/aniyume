'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatSidebar from '@/components/chat/ChatSidebar';

export interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    gifUrl?: string;
    senderId: number;
    timestamp: Date;
}

export interface ChatPreview {
    id: number;
    name: string;
    is_online: boolean;
    lastMessage?: string;
    unreadCount?: number;
}

export default function ChatPage() {
    const params = useParams();
    const friendId = Number(params.id);

    const [chats, setChats] = useState<ChatPreview[]>([
        { id: 1, name: 'Кирито', is_online: true, lastMessage: 'Залетаю через 5 минут 🚀', unreadCount: 2 },
        { id: 2, name: 'Асуна', is_online: true, lastMessage: 'Привет! Го в пати?' },
        { id: 3, name: 'Саске', is_online: false, lastMessage: 'Я вернусь в Коноху...' },
    ]);

    const activeChatName = chats.find(c => c.id === friendId)?.name || `NICKNAME_${friendId}`;
    const isActiveOnline = chats.find(c => c.id === friendId)?.is_online ?? true;

    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Привет! Го в пати?', senderId: friendId, timestamp: new Date(Date.now() - 3600000) },
        { id: '2', text: 'Залетаю через 5 минут 🚀', senderId: 0, timestamp: new Date(Date.now() - 3500000) },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    const handleSendMessage = (data: { text?: string; gif?: string; image?: File }) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            text: data.text,
            gifUrl: data.gif, // Если пришла гифка
            senderId: 0,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMsg]);
    };

    return (
        <div className="h-screen max-h-screen bg-white dark:bg-[#111111] transition-colors overflow-hidden relative flex">
            <style jsx global>{`
                .custom-glass {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(15px);
                }
                .dark .custom-glass {
                    background: rgba(20, 20, 20, 0.4);
                }
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



            <ChatSidebar
                chats={chats}
                activeChatId={friendId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
                <ChatHeader
                    friendId={friendId}
                    friendName={activeChatName}
                    isOnline={isActiveOnline}
                />


                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 py-8 flex flex-col gap-6"
                >
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} isMe={msg.senderId === 0} />
                    ))}

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-200 dark:border-white/5 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-75" />
                                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-150" />
                            </div>
                        </motion.div>
                    )}

                </div>

                <ChatInput onSend={handleSendMessage} />
            </div>
        </div>
    );
}
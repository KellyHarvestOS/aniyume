'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    gifUrl?: string;
    senderId: number;
    timestamp: Date;
}

interface ChatMessageProps {
    msg: Message;
    isMe: boolean;
}

export default function ChatMessage({ msg, isMe }: ChatMessageProps) {

    const isOnlyEmojis = (str: string) => {
        if (!str || !str.trim()) return false;

        const cleanStr = str.replace(/\s/g, '');

  
        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[\u2700-\u27bf])/g;

        const textWithoutEmojis = cleanStr.replace(emojiRegex, '');


        return textWithoutEmojis.length === 0 && Array.from(cleanStr).length <= 5;
    };

    const emojiOnly = msg.text ? isOnlyEmojis(msg.text) : false;
    const mediaUrl = msg.gifUrl || msg.imageUrl;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full mb-4`}
        >
            <div className={`max-w-[85%] lg:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>

                {mediaUrl && (
                    <div className={`mb-1 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                        <img
                            src={mediaUrl}
                            alt="media"
                            className="max-w-full max-h-[300px] object-contain bg-gray-50 dark:bg-white/5"
                        />
                    </div>
                )}

                {msg.text && (
                    <div className={`
                        relative transition-all duration-300
                        ${emojiOnly
                            ? 'bg-transparent !p-0 !border-none !shadow-none text-6xl my-2 select-none'
                            : `px-4 py-2.5 rounded-2xl text-[15px] font-medium leading-snug shadow-sm ${isMe
                                ? 'bg-brand text-white dark:text-black rounded-br-sm'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-white/5'
                            }`
                        }
                    `}>
                        {msg.text}
                    </div>
                )}

                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter opacity-60 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
}
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { IoClose, IoSend } from 'react-icons/io5';
import { FaCopy } from 'react-icons/fa6';
import { PiSoundcloudLogoFill } from "react-icons/pi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AiChatGatewayError, fetchAiChatSession, fetchAiChatSessions, sendAiChatMessage } from '@/lib/aiChat';
import type { AiChatDirection, AiChatHistoryMessage, AiChatPageContext, AiChatSessionSummary, AiChatTranscriptItem } from '@/types/ai-chat';

type Message = AiChatTranscriptItem & {
    id: string;
    role?: string;
    createdAt?: string | null;
};

const createMessage = (direction: AiChatDirection, content: string): Message => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    direction,
    content,
    createdAt: new Date().toISOString(),
});

const toChatDirection = (message: AiChatHistoryMessage): AiChatDirection => {
    if (message.direction === 'inbound' || message.direction === 'outgoing' || message.role === 'user') {
        return 'outgoing';
    }

    return 'incoming';
};

const createHistoryMessage = (message: AiChatHistoryMessage, index: number): Message => ({
    id: `${message.created_at ?? 'history'}-${index}-${Math.random().toString(36).slice(2)}`,
    direction: toChatDirection(message),
    content: message.content,
    role: message.role,
    createdAt: message.created_at,
});

const formatSessionDate = (value?: string | null) => {
    if (!value) return 'Без даты';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Без даты';

    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
};

const formatMessageTime = (value?: string | null) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function ChatModal({ onClose }: { onClose: () => void }) {
    const controls = useAnimation();
    const modalRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [limits, setLimits] = useState<string[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const [sessions, setSessions] = useState<AiChatSessionSummary[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSessionsLoading, setIsSessionsLoading] = useState(false);
    const [isSessionLoading, setIsSessionLoading] = useState(false);
    const [historyUnavailable, setHistoryUnavailable] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, isSessionLoading]);

    useEffect(() => {
        controls.start({ x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }, [controls]);

    const loadSessions = async () => {
        setIsSessionsLoading(true);
        try {
            const result = await fetchAiChatSessions();
            setSessions(result);
            setHistoryUnavailable(false);
        } catch (error) {
            console.warn('AI chat history list unavailable:', error);
            setHistoryUnavailable(true);
        } finally {
            setIsSessionsLoading(false);
        }
    };

    useEffect(() => {
        void loadSessions();
    }, []);

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(undefined);
        setInput('');
        setErrorMessage(null);
        setLimits([]);
        setIsHistoryOpen(false);
    };

    const handleOpenSession = async (nextSessionId: string) => {
        if (isLoading || isSessionLoading) return;

        setIsSessionLoading(true);
        setErrorMessage(null);
        setLimits([]);

        try {
            const result = await fetchAiChatSession(nextSessionId);
            setSessionId(result.sessionId);
            setMessages(result.messages.map(createHistoryMessage));
            setInput('');
            setIsHistoryOpen(false);
            setHistoryUnavailable(false);
        } catch (error) {
            console.warn('AI chat session history unavailable:', error);
            setHistoryUnavailable(true);
            setErrorMessage('История этого чата временно недоступна. Новый чат продолжает работать.');
        } finally {
            setIsSessionLoading(false);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading || isSessionLoading) return;

        const userMsg = createMessage('outgoing', text);
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput('');
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const pageContext: AiChatPageContext | undefined = typeof window === 'undefined'
                ? undefined
                : { route: window.location.pathname, locale: navigator.language?.slice(0, 10) };
            const result = await sendAiChatMessage(text, { sessionId, pageContext });
            setSessionId(result.sessionId);
            setLimits(result.limits);
            setMessages(prev => [...prev, createMessage('incoming', result.content)]);
            void loadSessions();
        } catch (error) {
            console.error('AI chat gateway error:', error);
            setLimits(error instanceof AiChatGatewayError ? error.limits : []);
            setErrorMessage(
                error instanceof AiChatGatewayError && error.status === 429
                    ? 'Лимит AI-чата временно исчерпан. Попробуйте позже.'
                    : 'AI-сервис временно недоступен. Попробуйте повторить запрос позже.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const windowWidth = window.innerWidth;
        const modalWidth = modalRef.current?.offsetWidth || 380;
        if (info.point.x < windowWidth / 2) {
            controls.start({ x: -(windowWidth - modalWidth - 48), transition: { type: 'spring', stiffness: 250, damping: 25 } });
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } });
        }
    };

    const handleCopyAssistantMessage = async (message: Message) => {
        if (message.direction !== 'incoming') return;

        try {
            await navigator.clipboard.writeText(message.content);
            setCopiedMessageId(message.id);
            window.setTimeout(() => setCopiedMessageId(current => current === message.id ? null : current), 1500);
        } catch (error) {
            console.warn('Failed to copy AI chat message:', error);
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
                        <span className="text-[10px] opacity-80 uppercase font-medium">AI Gateway</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsHistoryOpen(prev => !prev)}
                        className="text-[11px] font-bold text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg"
                        type="button"
                    >
                        История
                    </button>
                    <button onClick={onClose} className="text-white hover:bg-white/10 p-1.5 rounded-lg"><IoClose size={22} /></button>
                </div>
            </div>

            {isHistoryOpen && (
                <div className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-700 dark:text-gray-200">AI chat history</span>
                        <button
                            type="button"
                            onClick={handleNewChat}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-60"
                            disabled={isLoading || isSessionLoading}
                        >
                            Новый чат
                        </button>
                    </div>

                    {historyUnavailable && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2">
                            История временно недоступна, основной чат работает без изменений.
                        </div>
                    )}

                    <div className="max-h-28 overflow-y-auto custom-scrollbar space-y-1">
                        {isSessionsLoading ? (
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 px-1 py-2">Загрузка истории...</div>
                        ) : sessions.length === 0 ? (
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 px-1 py-2">Прошлых AI-чатов пока нет.</div>
                        ) : sessions.map((session) => (
                            <button
                                key={session.session_id}
                                type="button"
                                onClick={() => handleOpenSession(session.session_id)}
                                disabled={isLoading || isSessionLoading}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all disabled:opacity-60 ${session.session_id === sessionId
                                    ? 'bg-brand/10 border-brand/40 text-brand'
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-gray-300 hover:border-brand/40'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-bold truncate">Чат {session.session_id.slice(0, 8)}</span>
                                    <span className="text-[10px] opacity-70 shrink-0">{formatSessionDate(session.last_message_at ?? session.updated_at ?? session.created_at)}</span>
                                </div>
                                <div className="text-[10px] opacity-70 mt-0.5">
                                    {session.messages_count ?? 0} сообщ.
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc] dark:bg-[#0d0d0d] custom-scrollbar">
                {isSessionLoading && (
                    <div className="text-xs text-slate-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl p-3">
                        Загружаем выбранную историю...
                    </div>
                )}
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.direction === 'outgoing'
                            ? 'bg-brand text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/5 rounded-tl-none'
                            }`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    strong: ({ node, ...props }) => { void node; return <strong className="font-black text-brand dark:text-brand" {...props} />; },
                                    ul: ({ node, ...props }) => { void node; return <ul className="list-disc ml-4 my-2" {...props} />; },
                                    ol: ({ node, ...props }) => { void node; return <ol className="list-decimal ml-4 my-2" {...props} />; },
                                    a: ({ node, ...props }) => { void node; return <a className="text-brand underline hover:no-underline" target="_blank" {...props} />; },
                                    p: ({ node, ...props }) => { void node; return <p className="mb-1 last:mb-0" {...props} />; },
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                            <div className={`mt-2 flex items-center gap-2 text-[10px] opacity-70 ${msg.direction === 'outgoing' ? 'justify-end text-white' : 'justify-between text-slate-500 dark:text-gray-400'}`}>
                                <div>
                                    {[msg.role, formatMessageTime(msg.createdAt)].filter(Boolean).join(' · ')}
                                </div>
                                {msg.direction === 'incoming' && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopyAssistantMessage(msg)}
                                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-brand dark:text-gray-400 dark:hover:bg-white/10"
                                        aria-label="Скопировать сообщение ассистента"
                                        title="Скопировать"
                                    >
                                        <FaCopy size={11} />
                                        <span>{copiedMessageId === msg.id ? 'Скопировано' : 'Копия'}</span>
                                    </button>
                                )}
                            </div>
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
                {errorMessage && (
                    <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl p-3">
                        {errorMessage}
                    </div>
                )}
                {limits.length > 0 && (
                    <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 space-y-1">
                        {limits.map((limit) => (
                            <div key={limit}>{limit}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-[#0f0f0f] border-t border-slate-200 dark:border-white/5">
                {!isLoading && messages.length === 0 && (
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
                        placeholder="Напишите сообщение..."
                        disabled={isSessionLoading}
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none dark:text-gray-200"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isSessionLoading || !input.trim()}
                        className="bg-brand text-white p-2.5 rounded-lg shadow-lg hover:shadow-brand/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <IoSend size={16} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

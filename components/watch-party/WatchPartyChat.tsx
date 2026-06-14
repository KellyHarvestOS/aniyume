'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '@/hooks/useWatchParty';
import { useI18n } from '@/contexts/I18nContext';

interface WatchPartyChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  currentUserId?: number;
  className?: string;
}

export default function WatchPartyChat({ messages, onSend, currentUserId, className = '' }: WatchPartyChatProps) {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Скроллим ТОЛЬКО внутренний контейнер чата (не bubbling к странице),
  // и только когда реально появилось новое сообщение.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-black/30 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <MessageSquare className="w-4 h-4 text-[#00E2C4]" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('wp.roomChat')}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <div className="text-center text-gray-400 dark:text-white/30 text-sm py-8">
              {t('wp.noMessages')}
            </div>
          )}
          {messages.map((msg) => {
            const isOwn = msg.user_id === currentUserId;
            if (msg.type === 'system') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-gray-400 dark:text-white/40 text-xs py-1"
                >
                  {msg.message}
                </motion.div>
              );
            }
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 mt-0.5">
                  {msg.user_avatar ? (
                    <img src={msg.user_avatar} alt={msg.user_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 dark:text-white/60 font-bold">
                      {msg.user_name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  {!isOwn && (
                    <span className="text-[10px] text-gray-500 dark:text-white/40 px-1">{msg.user_name}</span>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-tight break-words ${
                    isOwn
                      ? 'bg-[#00E2C4]/15 text-gray-900 dark:text-white rounded-tr-sm border border-[#00E2C4]/30'
                      : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white/90 rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-white/25 px-1">{formatTime(msg.created_at)}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-200 dark:border-white/10">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t('wp.messagePlaceholder')}
            rows={1}
            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-[#00E2C4]/50 resize-none transition-colors"
            style={{ maxHeight: '80px', overflowY: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#00E2C4]/20 hover:bg-[#00E2C4]/30 border border-[#00E2C4]/40 text-[#00E2C4] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

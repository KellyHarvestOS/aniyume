'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaImage, FaSmile, FaTimes, FaSearch } from 'react-icons/fa';
import { MdGif } from 'react-icons/md';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ALL_GIFS } from '@/app/profile/friends/chat/constants/gifs';
import ImageCropModal from '@/components/modals/ImageCropModal';

interface ChatInputProps {
    onSend: (data: { text?: string; gif?: string; image?: File }) => void;
}

const BANNED_WORDS = ['плохоеслово', 'мат', 'оскорбление'];

export default function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [showGif, setShowGif] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [gifs, setGifs] = useState<any[]>(ALL_GIFS);
    const [gifSearch, setGifSearch] = useState('');
    const GIPHY_KEY = 'js0zHcg7OeHSMBq2gHQg7sQpdGzgvjIB';

    const [isMuted, setIsMuted] = useState(false);
    const [muteTimer, setMuteTimer] = useState(0);
    const lastClickTimes = useRef<number[]>([]);


    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        const file = new File([blob], `img_${Date.now()}.jpg`, { type: "image/jpeg" });
        onSend({ image: file });
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const fetchGifs = async () => {
        if (!gifSearch.trim()) {
            setGifs(ALL_GIFS);
            return;
        }
        try {
            const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(gifSearch)}&limit=20&rating=g`;
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error('API Error');
            const responseData = await res.json();
            if (responseData && responseData.data && responseData.data.length > 0) {
                const formatted = responseData.data.map((g: any) => ({
                    id: g.id,
                    url: g.images.fixed_height.url
                }));
                setGifs(formatted);
            } else {
                setGifs(ALL_GIFS);
            }
        } catch (err) {
            setGifs(ALL_GIFS);
        }
    };

    useEffect(() => {
        if (showGif) {
            const delayDebounceFn = setTimeout(() => { fetchGifs(); }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [gifSearch, showGif]);


    const checkSpam = () => {
        const now = Date.now();
        lastClickTimes.current = lastClickTimes.current.filter(t => now - t < 2000);
        lastClickTimes.current.push(now);
        if (lastClickTimes.current.length > 3) {
            setIsMuted(true);
            setMuteTimer(5);
            const interval = setInterval(() => {
                setMuteTimer(prev => {
                    if (prev <= 1) { clearInterval(interval); setIsMuted(false); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return true;
        }
        return false;
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isMuted || !message.trim()) return;
        if (checkSpam()) return;
        const filteredMessage = message;
        onSend({ text: filteredMessage });
        setMessage('');
        setShowEmoji(false);
    };

    const handleGifSend = (url: string) => {
        if (isMuted || checkSpam()) return;
        onSend({ gif: url });
        setShowGif(false);
    };

    return (
        <div className="relative pb-6 pt-2 shrink-0 px-4 md:px-8 z-20">

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <AnimatePresence>
                {selectedImage && (
                    <ImageCropModal
                        image={selectedImage}
                        onCropComplete={handleCropComplete}
                        onClose={() => setSelectedImage(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGif && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-4 left-4 right-4 md:left-8 md:right-8 custom-glass rounded-xl border border-gray-100 dark:border-white/5 p-4 h-[400px] flex flex-col gap-3 z-50 bg-white dark:bg-[#111111]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand">Giphy & Manual</span>
                            <button onClick={() => setShowGif(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                        </div>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                            <input
                                type="text"
                                placeholder="Поиск анимаций..."
                                value={gifSearch}
                                onChange={(e) => setGifSearch(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:border-brand/30 rounded-xl py-2 pl-9 pr-4 text-xs outline-none transition-all"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 no-scrollbar">
                            {gifs.map((gif) => (
                                <img
                                    key={gif.id}
                                    src={gif.url}
                                    onClick={() => handleGifSend(gif.url)}
                                    className="w-full h-24 object-cover rounded-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gray-100 dark:bg-white/5"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-full mb-4 right-8">
                <AnimatePresence>
                    {showEmoji && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="z-50 relative">
                            <EmojiPicker
                                theme={Theme.DARK}
                                width={320}
                                height={400}
                                onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
                                lazyLoadEmojis={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <form
                onSubmit={handleSend}
                className={`custom-glass rounded-xl p-2 flex items-end gap-2 border border-gray-100 dark:border-white/5 transition-all
                    ${isMuted ? 'opacity-50 grayscale' : 'focus-within:border-brand/30'}
                `}
            >
                <div className="flex gap-1 pb-1 pl-1">
                    <button
                        type="button"
                        onClick={handleImageClick}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-brand flex items-center justify-center transition-all"
                    >
                        <FaImage size={18} />
                    </button>
                    {/* Кнопка ГИФ */}
                    <button
                        type="button"
                        onClick={() => { setShowGif(!showGif); setShowEmoji(false); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showGif ? 'bg-brand/20 text-brand' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-brand'}`}
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
                                handleSend();
                            }
                        }}
                        disabled={isMuted}
                        placeholder={isMuted ? `Подождите ${muteTimer}с...` : "Написать сообщение..."}
                        className="w-full bg-transparent resize-none outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-500 py-3 px-2 max-h-32 min-h-[44px] no-scrollbar"
                        rows={1}
                    />
                </div>

                <div className="flex gap-2 pb-1 pr-1">
                    <button
                        type="button"
                        onClick={() => { setShowEmoji(!showEmoji); setShowGif(false); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showEmoji ? 'bg-brand/20 text-brand' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-brand'}`}
                    >
                        <FaSmile size={18} />
                    </button>

                    <button
                        type="submit"
                        disabled={!message.trim() || isMuted}
                        className="w-12 h-12 bg-brand text-white dark:text-black rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 hover:brightness-110"
                    >
                        <FaPaperPlane size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
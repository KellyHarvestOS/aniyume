'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface JoinRoomModalProps {
  onClose: () => void;
  defaultCode?: string;
}

export default function JoinRoomModal({ onClose, defaultCode = '' }: JoinRoomModalProps) {
  const [code, setCode] = useState(defaultCode.toUpperCase());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4) {
      setError('Введите код комнаты');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post(`/watch-party/${trimmed}/join`, {});
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Не удалось войти в комнату');
        return;
      }
      router.push(`/watch-party/${trimmed}`);
      onClose();
    } catch {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="font-semibold text-white">Войти в комнату</span>
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-white/50">Введите 6-значный код комнаты, который дал вам друг</p>

            {/* Code Input */}
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={code}
                onChange={e => {
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
                  setError('');
                }}
                onKeyDown={handleKey}
                placeholder="ABC123"
                maxLength={8}
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-mono tracking-widest placeholder-white/20 outline-none focus:border-[#00E2C4]/50 transition-colors text-center uppercase"
                autoFocus
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={handleJoin}
              disabled={isLoading || code.length < 4}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E2C4] to-[#00B4A0] text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Войти <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

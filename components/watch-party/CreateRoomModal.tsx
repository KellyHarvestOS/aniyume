'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Users, Lock, Tv, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Anime {
  id: number;
  title: string;
  poster_url?: string;
}

interface CreateRoomModalProps {
  anime: Anime;
  episodeNumber: number;
  onClose: () => void;
  onCreated: (roomCode: string) => void;
}

export default function CreateRoomModal({ anime, episodeNumber, onClose, onCreated }: CreateRoomModalProps) {
  const { user } = useAuth();
  const participantLimit = user?.is_premium ? 10 : 2;
  const [maxParticipants, setMaxParticipants] = useState(participantLimit);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMaxParticipants(participantLimit);
  }, [participantLimit]);

  const handleCreate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/watch-party', {
        anime_id: anime.id,
        episode_number: episodeNumber,
        max_participants: maxParticipants,
        is_private: isPrivate,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Ошибка создания комнаты');
        return;
      }
      onCreated(data.room.code);
    } catch {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <Tv className="w-4 h-4 text-brand" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Создать комнату</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Anime Info */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              {anime.poster_url && (
                <img src={anime.poster_url} alt={anime.title} className="w-10 h-14 object-cover rounded-lg" />
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-0.5">Будете смотреть</p>
                <p className="text-gray-900 dark:text-white font-medium text-sm leading-tight">{anime.title}</p>
                <p className="text-brand text-xs mt-0.5">Эпизод {episodeNumber}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-white/60 mb-2">
                <Users className="w-3.5 h-3.5 inline mr-1.5" />
                Максимум участников: <span className="text-gray-900 dark:text-white font-semibold">{maxParticipants}</span>
              </label>
              <input
                type="range"
                min={2}
                max={participantLimit}
                value={maxParticipants}
                onChange={e => setMaxParticipants(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-white/30 mt-1">
                <span>2</span>
                <span>{participantLimit}</span>
              </div>
              {!user?.is_premium && (
                <p className="mt-2 text-xs text-white/40">Premium позволяет создавать комнаты до 10 участников.</p>
              )}
            </div>

            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500 dark:text-white/50" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Приватная комната</p>
                  <p className="text-xs text-gray-500 dark:text-white/40">Только по коду или ссылке</p>
                </div>
              </div>
              <div className={`w-10 h-5.5 rounded-full transition-colors relative ${isPrivate ? 'bg-brand' : 'bg-gray-300 dark:bg-white/20'}`}
                style={{ height: '22px', width: '40px' }}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isPrivate ? 'translate-x-[20px]' : 'translate-x-0.5'}`} />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Создать комнату
                  <ChevronRight className="w-4 h-4"/>
                </>
              )}
            </button> 
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import type { Participant } from '@/hooks/useWatchParty';
import { useI18n } from '@/contexts/I18nContext';

interface ParticipantsListProps {
  participants: Participant[];
  hostId?: number;
  currentUserId?: number;
  maxParticipants?: number;
}

export default function ParticipantsList({
  participants,
  hostId,
  currentUserId,
  maxParticipants = 10,
}: ParticipantsListProps) {
  const { t } = useI18n();
  return (
    <div className="bg-white dark:bg-black/30 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E2C4] animate-pulse" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('wp.participants')}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-white/40">
          {participants.length} / {maxParticipants}
        </span>
      </div>

      {/* List */}
      <div className="p-3 space-y-1.5">
        <AnimatePresence>
          {participants.map((p) => {
            const isHost = p.id === hostId || p.is_host;
            const isCurrentUser = p.id === currentUserId;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors ${
                  isCurrentUser ? 'bg-brand/10 dark:bg-white/5' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-white/60">
                        {p.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Online dot */}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00E2C4] rounded-full border-2 border-white dark:border-black" />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium truncate ${isCurrentUser ? 'text-[#00E2C4]' : 'text-gray-800 dark:text-white'}`}>
                      {p.name}
                      {isCurrentUser && t('wp.youSuffix')}
                    </span>
                    {isHost && (
                      <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {participants.length === 0 && (
          <div className="text-center text-gray-400 dark:text-white/30 text-sm py-4">
            {t('wp.connectingShort')}
          </div>
        )}
      </div>
    </div>
  );
}

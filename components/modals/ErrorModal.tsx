// components/layout/Modal.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success';
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтверждение',
  message = 'Вы уверены, что хотите выполнить это действие?',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  type = 'danger',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-xs animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative z-1001 w-full max-w-[380px] rounded-lg border border-brand dark:border-brand bg-white dark:bg-[#0d0d0d] p-8 shadow-[0_0_100px_-20px_rgba(57,188,186,0.3)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-40 w-45 items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] shadow-inner">
            <Image
              src="/images/mi.png"
              alt="Logo"
              width={160}
              height={100}
              className="object-contain "
            />
          </div>

          <h3 className="text-center text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>

        <p className="mb-10 px-2 text-center text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full rounded-xl py-4 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-xl transition-all active:scale-[0.97] hover:scale-[1.02] ${type === 'danger'
                ? 'bg-brand '
                : 'bg-brand '
              }`}
          >
            {confirmText}
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-transparent py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-200"
          >
            {cancelText}
          </button>
        </div>

        <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-brand to-transparent opacity-50" />
      </div>
    </div>
  );
}

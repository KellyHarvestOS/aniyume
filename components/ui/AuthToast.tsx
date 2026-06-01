"use client";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type AuthToastProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "danger";
};

export default function AuthToast({ isOpen, title, message, type }: AuthToastProps) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-1000 w-[calc(100%-32px)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-top-3 duration-300">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex items-start gap-4 rounded-2xl border bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:bg-[#0f0f0f]/95 ${isSuccess
          ? "border-[#2EC4B6]/40 shadow-[#2EC4B6]/20"
          : "border-red-400/50 shadow-red-500/15"
          }`}
      >
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-lg ${isSuccess
            ? "bg-[#2EC4B6] shadow-[#2EC4B6]/30"
            : "bg-red-500 shadow-red-500/25"
            }`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationTriangle />}
        </div>

        <div className="min-w-0 pt-0.5">
          <p className={`text-xs font-black uppercase tracking-[0.22em] ${isSuccess ? "text-[#2EC4B6]" : "text-red-500"}`}>
            {title}
          </p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-200">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

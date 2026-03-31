'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#0B0C10] transition-colors duration-500">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2EC4B6]/30 dark:bg-[#2EC4B6]/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob" />

      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-300/40 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-300/30 dark:bg-emerald-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[130px] animate-blob animation-delay-4000" />

      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] dark:opacity-[0.06] pointer-events-none mix-blend-overlay" />

      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-sm transition-all duration-300 group"
      >
        <IoMdArrowRoundBack className="text-xl text-[#2f2f2f] dark:text-[#ffffff] group-hover:-translate-x-1 transition-transform" />
        <span>Назад</span>
      </button>

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
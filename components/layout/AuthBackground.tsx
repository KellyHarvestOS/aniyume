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

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2EC4B6]/40 dark:bg-[#2EC4B6]/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob" />

      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-300/50 dark:bg-indigo-600/25 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-300/40 dark:bg-emerald-800/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[130px] animate-blob animation-delay-4000" />

      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')] opacity-[0.04] dark:opacity-[0.06] pointer-events-none mix-blend-overlay" />

      <button
        onClick={() => router.push('/')}
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
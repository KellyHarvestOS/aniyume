'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { RiRobot2Line } from "react-icons/ri";
import ChatModal from '@/components/modals/ChatModal';
import { AnimatePresence } from 'framer-motion';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <button
          onClick={scrollToTop}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 transform flex items-center justify-center
            bg-brand text-white 
            border-[3px] border-white 
            ring-2 ring-white dark:ring-black
            hover:scale-110 hover:shadow-brand hover:shadow-xl
            dark:border-gray-700
            ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0 pointer-events-none'}
          `}
        >
          <ArrowUp strokeWidth={3} className="w-6 h-6 dark:text-gray-800" />
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 transform flex items-center justify-center
            bg-brand text-white 
            border-[3px] border-white 
            ring-2 ring-white dark:ring-black
            hover:scale-110 hover:shadow-brand hover:shadow-xl
            dark:border-gray-700
            ${isChatOpen ? 'rotate-10 shadow-inner' : ''} 
          `}
        >
          <RiRobot2Line className="w-6 h-6 dark:text-gray-800" />
        </button>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <ChatModal onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CookieConsent from '../components/layout/CookieConsent';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutPages = ['/login', '/register', '/premium', '/premium/checkout', '/watch'];
  const hideLayout = noLayoutPages.includes(pathname);

  useEffect(() => {
    const checkPremium = () => {
      const isPremium = localStorage.getItem('isPremium') === 'true';
      if (isPremium) {
        document.documentElement.classList.add('is-premium');
      } else {
        document.documentElement.classList.remove('is-premium');
      }
    };

    checkPremium();

    window.addEventListener('storage', checkPremium);
    window.addEventListener('premiumUpdate', checkPremium);

    return () => {
      window.removeEventListener('storage', checkPremium);
      window.removeEventListener('premiumUpdate', checkPremium);
    };
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {!hideLayout && <Header />}

      <main className="w-full min-h-screen ">
        {children}
      </main>

      {!hideLayout && <Footer />}

      <CookieConsent />
    </div>
  );
}

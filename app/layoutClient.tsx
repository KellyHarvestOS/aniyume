'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CookieConsent from '../components/layout/CookieConsent';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutPages = ['/login', '/register', '/premium', '/watch'];
  const hideLayout = noLayoutPages.includes(pathname);
  const hideCarousel = pathname.startsWith('/anime/');

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {!hideLayout && <Header />}

      <main className="container mx-auto min-h-screen">
        {children}
      </main>

      {!hideLayout && <Footer />}

      <CookieConsent />
    </div>
  );
}
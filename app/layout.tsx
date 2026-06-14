import './globals.css'
import { Inter } from 'next/font/google'
import LayoutClient from './layoutClient'
import ScrollToTop from "@/components/layout/FloatingActions";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { FingerprintInit } from "@/components/FingerprintInit";
import GlobalBroadcastListener from "@/components/GlobalBroadcastListener";
import Gazan67Listener from "@/components/Gazan67Listener";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aniyume - Платформа для просмотра аниме',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <FingerprintInit />
              <GlobalBroadcastListener />
              <Gazan67Listener />
              <LayoutClient>
                {children}
                <ScrollToTop />
              </LayoutClient>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

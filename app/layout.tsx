import './globals.css'
import { Inter } from 'next/font/google'
import LayoutClient from './layoutClient'
import ScrollToTop from "@/components/layout/FloatingActions";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aniyume - Платформа для просмотра аниме',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutClient>
              {children}
              <ScrollToTop />
            </LayoutClient>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/contexts/AuthModalContext';

// Роут сохранён как точка входа: открывает модалку логина поверх главной.
export default function LoginPage() {
  const router = useRouter();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    openAuth('login');
    router.replace('/');
  }, [openAuth, router]);

  return null;
}

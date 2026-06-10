'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/contexts/AuthModalContext';

// Роут сохранён как точка входа: открывает модалку регистрации поверх главной.
export default function RegisterPage() {
  const router = useRouter();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    openAuth('register');
    router.replace('/');
  }, [openAuth, router]);

  return null;
}

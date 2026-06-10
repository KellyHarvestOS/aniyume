'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export type AuthModalView = 'login' | 'register' | 'forgot';

interface AuthModalContextType {
  view: AuthModalView | null;
  openAuth: (view?: AuthModalView) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  view: null,
  openAuth: () => {},
  closeAuth: () => {},
});

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthModalView | null>(null);

  const openAuth = useCallback((next: AuthModalView = 'login') => setView(next), []);
  const closeAuth = useCallback(() => setView(null), []);

  return (
    <AuthModalContext.Provider value={{ view, openAuth, closeAuth }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);

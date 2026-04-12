'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  is_premium?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При монтировании: проверяем токен → загружаем профиль
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    fetch('/api/external/profile/me', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
        Accept: 'application/json',
      },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user || data))
      .catch(() => {
        // Токен невалидный — очищаем
        localStorage.removeItem('userToken');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext);

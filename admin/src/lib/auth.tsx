import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Account } from '@/types/admin';
import { ADMIN_ACCOUNT } from '@/data/admin-account';
import { sessionStorage } from './storage';

type AuthContextValue = {
  user: Account | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  /** Kept so the UI compiles, but does nothing. */
  changePassword: (current: string, next: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(() => sessionStorage.get());

  const login = useCallback((username: string, password: string) => {
    const matches =
      username.trim().toLowerCase() === ADMIN_ACCOUNT.username.toLowerCase() &&
      password === ADMIN_ACCOUNT.password;
    if (!matches) throw new Error('Username or password is incorrect.');
    sessionStorage.set(ADMIN_ACCOUNT);
    setUser(ADMIN_ACCOUNT);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  // Intentionally does nothing. Kept only so PasswordForm.tsx compiles.
  const changePassword = useCallback((_current: string, _next: string) => {
    /* no-op */
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, changePassword }),
    [user, login, logout, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
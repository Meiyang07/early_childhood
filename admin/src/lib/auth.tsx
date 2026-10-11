// src/lib/auth.tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthUser, LoginInput } from "@/types/auth";

import type { ApiError } from "./api";
import { loginRequest, logoutRequest, meRequest } from "./auth.api";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ME_KEY = ["auth", "me"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  // 1) Bootstrap session on mount by hitting /auth/me.
  //    A 401 is expected when not logged in — treat as `null`, don't retry.
  const meQuery = useQuery<AuthUser | null, ApiError>({
    queryKey: ME_KEY,
    queryFn: async () => {
      try {
        return await meRequest();
      } catch (err) {
        if ((err as ApiError)?.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 2) Login mutation
  const loginMutation = useMutation<AuthUser, ApiError, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      // Seed the cache so RequireAuth immediately sees the user
      qc.setQueryData(ME_KEY, user);
    },
  });

  // 3) Logout mutation
  const logoutMutation = useMutation<void, ApiError, void>({
    mutationFn: logoutRequest,
    onSettled: () => {
      qc.setQueryData(ME_KEY, null);
      qc.removeQueries(); // wipe any cached portal data tied to the session
    },
  });

  const login = useCallback(
    async (input: LoginInput) => {
      await loginMutation.mutateAsync(input);
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isLoading: meQuery.isLoading,
      isAuthenticated: !!meQuery.data,
      login,
      logout,
    }),
    [meQuery.data, meQuery.isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
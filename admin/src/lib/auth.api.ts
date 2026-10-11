// src/lib/auth-api.ts
import { api } from "./api";
import type { AuthUser, LoginInput } from "@/types/auth";

interface Envelope<T> {
  success: boolean;
  data: T;
}

export async function loginRequest(input: LoginInput): Promise<AuthUser> {
  const { data } = await api.post<Envelope<{ user: AuthUser }>>(
    "/auth/admin-login",
    input,
  );
  return data.data.user;
}

export async function meRequest(): Promise<AuthUser> {
  const { data } = await api.get<Envelope<{ user: AuthUser }>>("/auth/me");
  return data.data.user;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/admin-logout");
}

export async function refreshRequest(): Promise<void> {
  await api.post("/auth/refresh");
}
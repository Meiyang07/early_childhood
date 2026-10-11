// src/lib/api.ts
import axios, { AxiosError, type AxiosInstance } from "axios";

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,        // 👈 send/receive httpOnly cookies
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/** Normalize every error into ApiError so UI never sees AxiosError. */
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: { message?: string; details?: unknown } }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      "Something went wrong";
    const details = error.response?.data?.error?.details;

    // Optional: auto-redirect on 401 (session expired)
    if (status === 401 && !location.pathname.startsWith("/login")) {
      // Let React Query handle it — avoid hard redirect here.
    }

    return Promise.reject<ApiError>({ status, message, details });
  },
);
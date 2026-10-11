// src/config/env.ts
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const NODE_ENV = process.env.NODE_ENV ?? "development";
dotenv.config({ path: path.join(rootDir, `.env.${NODE_ENV}`) });

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}
function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}
function num(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) throw new Error(`Env var ${key} must be a number`);
  return parsed;
}
function bool(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return raw === "true" || raw === "1";
}

const isProduction = NODE_ENV === "production";

export const env = Object.freeze({
  NODE_ENV,
  isProduction,
  isDevelopment: NODE_ENV === "development",
  isTest: NODE_ENV === "test",

  HOST: optional("HOST", "0.0.0.0"),
  PORT: num("PORT", 3000),

  CORS_ORIGIN: optional("CORS_ORIGIN", "http://localhost:5173")
    .split(",").map((s) => s.trim()).filter(Boolean),

  TRUST_PROXY: bool("TRUST_PROXY", false),

  RATE_LIMIT_WINDOW_MS: num("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  RATE_LIMIT_MAX: num("RATE_LIMIT_MAX", 300),

  // MongoDB
  DATABASE_URL: required("DATABASE_URL"),

  // JWT
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_TTL: required("ACCESS_TOKEN_TTL"),
  REFRESH_TOKEN_TTL: required("REFRESH_TOKEN_TTL"),

  // Cookies
  COOKIE_DOMAIN: optional("COOKIE_DOMAIN", ""),
  COOKIE_SECURE: bool("COOKIE_SECURE", isProduction),

  // ─────────────────────────────────────────────
  // Cloudinary
  // ─────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),


  // Upload constraint only — no temp dir, memory storage is used
  UPLOAD_MAX_FILE_SIZE_MB: num("UPLOAD_MAX_FILE_SIZE_MB", 5),
});
// src/types/settings.ts
import { z } from "zod";

export interface Settings {
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  workingDays: string;
  openTime: string;   // "HH:mm" 24h
  closeTime: string;  // "HH:mm" 24h
  adminName: string;
}

export const defaultSettings: Settings = {
  schoolName: "",
  email: "",
  phone: "",
  address: "",
  workingDays: "",
  openTime: "09:00",
  closeTime: "16:00",
  adminName: "Admin",
};

export const settingsSchema = z
  .object({
    schoolName: z.string().trim().min(2).max(120),
    email: z.string().email().max(200),
    phone: z.string().trim().min(5).max(40),
    address: z.string().trim().min(3).max(300),
    workingDays: z.string().trim().min(3).max(60),
    openTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    closeTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    adminName: z.string().trim().min(1).max(60),
  })
  .strict()
  .refine((v) => v.openTime < v.closeTime, {
    message: "Closing time must be after opening time.",
    path: ["closeTime"],
  });

/** Format "HH:mm" → "9:00 AM" (UTC-safe, matches your original behavior) */
export function timeLabel(value: string): string {
  if (!/^\d{2}:\d{2}$/.test(value)) return "—";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(`2000-01-01T${value}:00Z`));
}
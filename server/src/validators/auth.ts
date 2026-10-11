import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ "message": "Email is required" })
    .trim()
    .email("Please enter a valid email address")
    .max(200, "Email must be at most 200 characters"),
  password: z
    .string({ "message": "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(200, "Password must be at most 200 characters"),
}).strict();

export type loginAdminInput = z.infer<typeof loginSchema>;
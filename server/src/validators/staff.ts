// src/validators/staff.ts
import { z } from "zod";
import { STAFF_STATUSES } from "../db/enums.js";

export const createStaffSchema = z
  .object({
    fullName: z.string().trim().min(2).max(160),
    email: z.string().trim().toLowerCase().email().max(200),
    password: z.string().min(8).max(200),
    role: z.string().trim().min(1).max(100),
    about: z.string().trim().min(1).max(5000),
    status: z.enum(STAFF_STATUSES).optional(),
  })
  .strict();

export type CreateStaffInput = z.infer<typeof createStaffSchema>;



export const listStaffQuerySchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    // "Admin" | "Teacher" | "Operator" — case-insensitive matching handled server-side
    role: z.string().trim().max(100).optional(),
     status: z.enum(["All", "Active", "Inactive"]).optional(),
  })
  ;

export type ListStaffQuery = z.infer<typeof listStaffQuerySchema>;
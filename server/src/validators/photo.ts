// src/validations/photo.validation.ts
import { z } from "zod";

const CATEGORIES = ["classroom", "activities", "outdoors", "graduation"] as const;
const STATUSES = ["draft", "published"] as const;

// ---------- CREATE (body only; image comes via multipart, handled separately) ----------
export const createPhotoSchema = z.object({
  title: z
    .string("Photo title is required")
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title cannot exceed 150 characters")
    .trim(),

  category: z.enum(CATEGORIES, {
    message: "Category must be one of: classroom, activities, outdoors, graduation",
  }),

  imageDescription: z
    .string("Image description is required")
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters")
    .trim(),

  status: z.enum(STATUSES).optional().default("draft"),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;

// ---------- UPDATE ----------
export const updatePhotoSchema = z
  .object({
    title: z.string().min(2).max(150).trim().optional(),
    category: z.enum(CATEGORIES).optional(),
    imageDescription: z.string().min(5).max(500).trim().optional(),
    status: z.enum(STATUSES).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided to update",
  });

export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;

// ---------- LIST QUERY ----------
export const listPhotoQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(["All", ...CATEGORIES]).optional().default("All"),
  status: z.enum(["All", ...STATUSES]).optional().default("All"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListPhotoQuery = z.infer<typeof listPhotoQuerySchema>;

// ---------- PARAM ----------
export const photoIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid photo ID"),
});

export type PhotoIdParam = z.infer<typeof photoIdParamSchema>;
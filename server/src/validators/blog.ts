// src/validations/blog.validation.ts
import { z } from "zod";

const STATUSES = ["draft", "published"] as const;

// ---------- CREATE ----------
export const createBlogSchema = z.object({
  title: z
    .string("Post title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title cannot exceed 200 characters")
    .trim(),

  postDate: z.coerce
    .date({ message: "Post date must be a valid date" })
    .optional()
    .default(() => new Date()),

  author: z
    .string("Author is required")
    .min(2, "Author must be at least 2 characters")
    .max(100, "Author cannot exceed 100 characters")
    .trim(),

  shortIntroduction: z
    .string("Short introduction is required")
    .min(10, "Short introduction must be at least 10 characters")
    .max(500, "Short introduction cannot exceed 500 characters")
    .trim(),

  article: z
    .string("Article is required")
    .min(50, "Article must be at least 50 characters")
    .max(50000, "Article cannot exceed 50000 characters")
    .trim(),

  status: z.enum(STATUSES).optional().default("draft"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;




// ---------- UPDATE ----------
export const updateBlogSchema = z
  .object({
    title: z.string().min(2).max(200).trim().optional(),
    postDate: z.coerce.date().optional(),
    author: z.string().min(2).max(100).trim().optional(),
    shortIntroduction: z.string().min(10).max(500).trim().optional(),
    article: z.string().min(50).max(50000).trim().optional(),
    status: z.enum(STATUSES).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided to update",
  });

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;




// ---------- LIST QUERY ----------
export const listBlogQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["All", ...STATUSES]).optional().default("All"),
  author: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListBlogQuery = z.infer<typeof listBlogQuerySchema>;

// ---------- PARAM ----------
export const blogIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid blog ID"),
});

export type BlogIdParam = z.infer<typeof blogIdParamSchema>;

// ---------- SLUG (if you add a slug field later) ----------
export const blogSlugParamSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is too short")
    .max(250, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
});

export type BlogSlugParam = z.infer<typeof blogSlugParamSchema>;
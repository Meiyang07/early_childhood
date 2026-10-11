import { z } from "zod";

// ---------- CREATE ----------
export const createProgramSchema = z.object({
  name: z
    .string("Program name is required")
    .min(2, "Program name must be at least 2 characters")
    .max(120, "Program name cannot exceed 120 characters")
    .trim(),

  ageRange: z
    .string("Age range is required")
    .min(1, "Age range is required")
    .max(50, "Age range cannot exceed 50 characters")
    .trim(),

  classDuration: z
    .string("Class duration is required")
    .min(1, "Class duration is required")
    .max(50, "Class duration cannot exceed 50 characters")
    .trim(),

  noOfTeachers: z
    .number("Number of teachers is required")
    .int("Number of teachers must be a whole number")
    .min(1, "At least 1 teacher is required")
    .max(50, "Number of teachers cannot exceed 50"),

  noOfChildren: z
    .number("Number of children is required")
    .int("Number of children must be a whole number")
    .min(1, "At least 1 child is required")
    .max(500, "Number of children cannot exceed 500"),

  monthlyFee: z
    .number("Monthly fee is required")
    .min(0, "Monthly fee cannot be negative")
    .max(1000000, "Monthly fee is too high"),

  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .trim(),

  status: z
    .enum(["published", "draft"], {
      message: "Status must be either 'published' or 'draft'",
    })
    .optional()
    .default("draft"),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;

// ---------- UPDATE ----------
export const updateProgramSchema = z
  .object({
    name: z.string().min(2).max(120).trim().optional(),
    ageRange: z.string().min(1).max(50).trim().optional(),
    classDuration: z.string().min(1).max(50).trim().optional(),
    noOfTeachers: z.number().int().min(1).max(50).optional(),
    noOfChildren: z.number().int().min(1).max(500).optional(),
    monthlyFee: z.number().min(0).max(1000000).optional(),
    description: z.string().min(10).max(2000).trim().optional(),
    status: z.enum(["published", "draft"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

// ---------- LIST QUERY ----------
export const listProgramQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z
    .enum(["All", "published", "draft"])
    .optional()
    .default("All"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListProgramQuery = z.infer<typeof listProgramQuerySchema>;

// ---------- PARAM ----------
export const programIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid program ID"),
});

export type ProgramIdParam = z.infer<typeof programIdParamSchema>;
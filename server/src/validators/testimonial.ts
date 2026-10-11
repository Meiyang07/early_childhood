import { z } from "zod";

export const createTestimonialSchema = z.object({
    parentName: z
        .string("Parent name is required")
        .min(2, "Parent name must be at least 2 characters")
        .max(100, "Parent name cannot exceed 100 characters")
        .trim(),

    relationship: z.enum(["Father", "Mother", "Guardian", "Other"], {
        message: "Relationship must be one of: Father, Mother, Guardian, Other",
    }),

    testimonial: z
        .string("Testimonial is required")
        .min(10, "Testimonial must be at least 10 characters")
        .max(1500, "Testimonial cannot exceed 1500 characters")
        .trim(),

    rating: z
        .number("Rating is required")
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),

    consentToPublish: z.boolean({
        message: "Publication consent is required",
    }),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;




export const listTestimonialQuerySchema = z.object({
    search: z.string().trim().optional(),
    status: z
        .enum(["All", "pending", "approved", "rejected"])
        .optional()
        .default("All"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListTestimonialQuery = z.infer<typeof listTestimonialQuerySchema>;



export const updateTestimonialSchema = z
    .object({
        parentName: z
            .string()
            .min(2, "Parent name must be at least 2 characters")
            .max(100, "Parent name cannot exceed 100 characters")
            .trim()
            .optional(),

        relationship: z
            .enum(["Father", "Mother", "Guardian", "Other"], {
                message: "Relationship must be one of: Father, Mother, Guardian, Other",
            })
            .optional(),

        testimonial: z
            .string()
            .min(10, "Testimonial must be at least 10 characters")
            .max(1500, "Testimonial cannot exceed 1500 characters")
            .trim()
            .optional(),

        rating: z
            .number()
            .int("Rating must be a whole number")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5")
            .optional(),

        consentToPublish: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
    });

export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;




// ---------- UPDATE STATUS ----------
export const updateTestimonialStatusSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"], {
        message: "Status must be one of: pending, approved, rejected",
    }),
});

export type UpdateTestimonialStatusInput = z.infer<
    typeof updateTestimonialStatusSchema
>;




// ---------- PARAMS (for :id) ----------
export const testimonialIdParamSchema = z.object({
    id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid testimonial ID"),
});

export type TestimonialIdParam = z.infer<typeof testimonialIdParamSchema>;
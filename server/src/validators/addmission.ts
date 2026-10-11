// src/validators/application.ts
import { z } from "zod";

const phoneRegex = /^\d{10}$/;

export const createApplicationSchema = z.object({
    // Note: Since you are using multer (multipart/form-data), all fields arrive as strings.
    // We must use z.coerce.date() or transform to convert the string to a Date object.
    childInfo: z.object({
        fullName: z
            .string("Child's full name is required")
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name cannot exceed 100 characters")
            .trim(),
        dateOfBirth: z.coerce.date({
            message: "Date of birth is required",
        }),
        gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
            message: "Gender must be one of: Male, Female, Other, Prefer not to say",
        }),
        applyingForProgram: z.enum(
            ["Playgroup", "Nursery", "Kindergarten", "Primary"],
            {
                message: "Program must be one of: Playgroup, Nursery, Kindergarten, Primary",
            }
        ),
    }),

    guardianInfo: z.object({
        fullName: z
            .string("Parent/Guardian name is required")
            .min(2, "Name must be at least 2 characters")
            .trim(),
        phoneNumber: z
            .string("Phone number is required")
            .regex(phoneRegex, "Phone number must be exactly 10 digits"),
        email: z
            .string("Email address is required")
            .email("Please provide a valid email address")
            .toLowerCase()
            .trim(),
        homeAddress: z
            .string("Home address is required")
            .min(5, "Address must be at least 5 characters")
            .trim(),
    }),

    additionalInfo: z
        .object({
            previousSchool: z.string().trim().optional().default(""),
            medicalConditions: z.string().trim().optional().default("None"),
            referralSource: z.string().trim().optional().default(""),
        })
        .optional()
        .default({ previousSchool: "exmple schoole", medicalConditions: "example medical", referralSource: "example refferal" }),
});

// Type inference for the controller
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// List Query Validator (for admin dashboard fetching all applications)
export const listApplicationQuerySchema = z.object({
    search: z.string().optional(),
    status: z
        .enum(["All", "Pending", "Reviewed", "Accepted", "Rejected", "Waitlisted"])
        .optional()
        .default("All"),
    program: z
        .enum(["All", "Playgroup", "Nursery", "Kindergarten", "Primary"])
        .optional()
        .default("All"),
});

export type ListApplicationQuery = z.infer<typeof listApplicationQuerySchema>;
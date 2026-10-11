// src/validations/event.validation.ts
import { z } from "zod";

const STATUSES = ["draft", "published"] as const;

// ---------- CREATE ----------
export const createEventSchema = z.object({
  title: z
    .string("Event title is required")
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title cannot exceed 150 characters")
    .trim(),

  eventDate: z.coerce.date({
    message: "Event date must be a valid date",
  }),

  time: z
    .string("Event time is required")
    .min(1, "Event time is required")
    .max(100, "Time cannot exceed 100 characters")
    .trim(),

  location: z
    .string("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(250, "Location cannot exceed 250 characters")
    .trim(),

  details: z
    .string("Event details are required")
    .min(10, "Details must be at least 10 characters")
    .max(3000, "Details cannot exceed 3000 characters")
    .trim(),

  status: z.enum(STATUSES).optional().default("draft"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;



// ---------- UPDATE ----------
export const updateEventSchema = z
  .object({
    title: z.string().min(2).max(150).trim().optional(),
    eventDate: z.coerce.date().optional(),
    time: z.string().min(1).max(100).trim().optional(),
    location: z.string().min(2).max(250).trim().optional(),
    details: z.string().min(10).max(3000).trim().optional(),
    status: z.enum(STATUSES).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided to update",
  });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;




// ---------- LIST QUERY ----------
export const listEventQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["All", ...STATUSES]).optional().default("All"),
  // filter by date range (optional, useful for calendar views)
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  // upcoming | past | all
  when: z.enum(["All", "upcoming", "past"]).optional().default("All"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type ListEventQuery = z.infer<typeof listEventQuerySchema>;



// ---------- PARAM ----------
export const eventIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid event ID"),
});

export type EventIdParam = z.infer<typeof eventIdParamSchema>;
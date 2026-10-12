// src/types/testimonial.ts

export const KEY = "testimonials";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  _id: string;
  parentName: string;
  relationship: "Father" | "Mother" | "Guardian" | "Other";
  testimonial: string;
  rating: number;
  status: TestimonialStatus;
  consentToPublish: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListTestimonialParams {
  search?: string;
  status?: "All" | TestimonialStatus;
  page?: number;
  limit?: number;
}

export interface ListTestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
  pagination: Pagination;
  filters: { search: string | null; status: string };
}

// ---------- Create ----------
export interface CreateTestimonialPayload {
  parentName: string;
  relationship: "Father" | "Mother" | "Guardian" | "Other";
  testimonial: string;
  rating: number;
  consentToPublish: boolean;
}

// ---------- Update status ----------
export interface UpdateTestimonialStatusPayload {
  status: TestimonialStatus;
}

// ---------- Update (partial) ----------
export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>;
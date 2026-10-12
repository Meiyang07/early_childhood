// src/types/program.ts

// ---------- Query key ----------
export const PROGRAMS_KEY = "programs";

// ---------- Status ----------
export type ProgramStatus = "published" | "draft";

// ---------- Entity ----------
export interface Program {
  _id: string;
  name: string;
  ageRange: string;
  classDuration: string;
  noOfTeachers: number;
  noOfChildren: number;
  monthlyFee: number;
  description: string;
  status: ProgramStatus;      // ⬅ was `string`, narrowed to the union
  createdAt: string;
  updatedAt: string;
}

// ---------- Pagination ----------
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ---------- List ----------
export interface ListProgramParams {
  search?: string;
  status?: "All" | ProgramStatus;
  page?: number;
  limit?: number;
}

export interface ListProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  pagination: Pagination;
  filters: { search: string | null; status: string };
}

// ---------- Create ----------
export interface CreateProgramPayload {
  name: string;
  ageRange: string;
  classDuration: string;
  noOfTeachers: number;
  noOfChildren: number;
  monthlyFee: number;
  description: string;
  status?: ProgramStatus;    // optional — server defaults to "draft"
}

// ---------- Update (partial) ----------
export type UpdateProgramPayload = Partial<CreateProgramPayload>;

// ---------- Update status ----------
export interface UpdateProgramStatusPayload {
  status: ProgramStatus;
}
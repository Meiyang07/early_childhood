// src/types/blog.ts

// ---------- Query key ----------
export const BLOGS_KEY = "blogs";

// ---------- Status ----------
export type BlogStatus = "draft" | "published";

// ---------- Entity (matches server response) ----------
export interface Blog {
  _id: string;
  title: string;
  postDate: string;                // ISO string from server
  author: string;
  shortIntroduction: string;
  article: string;
  status: BlogStatus;
  blogImage: string;               // Cloudinary secure_url
  blogImagePublicId: string;       // Cloudinary public_id
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
export interface ListBlogParams {
  search?: string;
  status?: "All" | BlogStatus;
  author?: string;
  from?: string;                   // ISO date string
  to?: string;                     // ISO date string
  page?: number;
  limit?: number;
}

export interface ListBlogsResponse {
  success: boolean;
  message: string;
  data: Blog[];
  pagination: Pagination;
  filters: {
    search: string | null;
    status: string;
    author: string | null;
    from: string | null;
    to: string | null;
  };
}

// ---------- Create (multipart — `image` sent as File) ----------
export interface CreateBlogPayload {
  title: string;
  postDate: string;                // ISO or "YYYY-MM-DD"
  author: string;
  shortIntroduction: string;
  article: string;
  status?: BlogStatus;             // server defaults to "draft"
  image: File;                     // attached as `image` field in FormData
}

// ---------- Update metadata (JSON, no file) ----------
export interface UpdateBlogPayload {
  title?: string;
  postDate?: string;
  author?: string;
  shortIntroduction?: string;
  article?: string;
  status?: BlogStatus;
}

// ---------- Replace image (multipart — only `image`) ----------
export interface ReplaceBlogImagePayload {
  image: File;
}
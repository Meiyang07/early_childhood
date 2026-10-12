// src/types/photo.ts

// ---------- Query key ----------
export const PHOTOS_KEY = "photos";

// ---------- Enums ----------
export type PhotoCategory =
  | "classroom"
  | "activities"
  | "outdoors"
  | "graduation";

export type PhotoStatus = "draft" | "published";

// ---------- Entity (matches server response) ----------
export interface Photo {
  _id: string;
  title: string;
  category: PhotoCategory;
  imageDescription: string;
  status: PhotoStatus;
  image: string;            // Cloudinary secure_url
  imagePublicId: string;    // Cloudinary public_id (for deletes / replaces)
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
export interface ListPhotoParams {
  search?: string;
  category?: "All" | PhotoCategory;
  status?: "All" | PhotoStatus;
  page?: number;
  limit?: number;
}

export interface ListPhotosResponse {
  success: boolean;
  message: string;
  data: Photo[];
  pagination: Pagination;
  filters: {
    search: string | null;
    category: string;
    status: string;
  };
}

// ---------- Create (multipart — `image` sent as File, rest as text) ----------
export interface CreatePhotoPayload {
  title: string;
  category: PhotoCategory;
  imageDescription: string;
  status?: PhotoStatus;         // server defaults to "draft"
  image: File;                  // attached as `image` field in FormData
}

// ---------- Update metadata (JSON, no file) ----------
export interface UpdatePhotoPayload {
  title?: string;
  category?: PhotoCategory;
  imageDescription?: string;
  status?: PhotoStatus;
}

// ---------- Replace image (multipart — only `image`) ----------
export interface ReplacePhotoImagePayload {
  image: File;
}
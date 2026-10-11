// src/constants/folders.ts
import { env } from "../config/env.js";

/**
 * Environment-aware prefix so dev uploads never mix with production.
 *   development → early_childhood/dev/...
 *   production  → early_childhood/prod/...
 */
const PREFIX = env.isProduction ? "early_childhood/prod" : "early_childhood/dev";

export const CLOUDINARY_FOLDERS = Object.freeze({
  STAFF: `${PREFIX}/staff`,
  GALLERY: `${PREFIX}/gallery`,
  BLOG: `${PREFIX}/blog`,
} as const);

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
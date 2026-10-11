// src/middlewares/upload.middleware.ts
import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

/**
 * We use memory storage on purpose:
 *  - No temp files are written to disk (critical on Render, where the
 *    filesystem is ephemeral and small).
 *  - The uploaded file lives only in req.file.buffer for the duration of
 *    the request and is reclaimed by Node's GC once the request ends.
 *  - No cleanup / cron sweep / orphan-file handling is required.
 */
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = /^image\/(jpeg|jpg|png|webp|gif)$/i;
  allowed.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files (jpg, png, webp, gif) are allowed"));
};

export const uploadSingle = (fieldName = "image") =>
  multer({
    storage,
    fileFilter,
    limits: { fileSize: env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024 },
  }).single(fieldName);

export const handleMulterError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError)
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  if (err) return res.status(400).json({ message: err.message });
  next();
};
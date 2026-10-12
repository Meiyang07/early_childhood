// src/routes/photo.routes.ts
import { Router } from "express";


import {
    createPhoto,
    listPhotos,
    getPhotoById,
    updatePhoto,
    replacePhotoImage,
    deletePhoto,
} from "../controllers/photo.controller.js";
import { createPhotoSchema, listPhotoQuerySchema, photoIdParamSchema, updatePhotoSchema } from "../validators/photo.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { handleMulterError, uploadSingle } from "../middleware/upload.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const photoRouter = Router();

// ---------- LIST ----------
photoRouter.get(
    "/list-photo",
    validate({ query: listPhotoQuerySchema }),
    asyncHandler(listPhotos)
);

// ---------- CREATE (multipart/form-data, field: "image") ----------
photoRouter.post(
    "/create-photo",
    requireAuth,
    requireRole("ADMIN"),
    uploadSingle("image"),
    handleMulterError,
    validate({ body: createPhotoSchema }),
    asyncHandler(createPhoto)
);

// ---------- GET BY ID ----------
photoRouter.get(
    "/single-photo/:id",
    validate({ params: photoIdParamSchema }),
    asyncHandler(getPhotoById)
);

// ---------- UPDATE METADATA (JSON, no file) ----------
photoRouter.patch(
    "/update/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: photoIdParamSchema, body: updatePhotoSchema }),
    asyncHandler(updatePhoto)
);

// ---------- REPLACE IMAGE (multipart/form-data, field: "image") ----------
photoRouter.patch(
    "/replace/:id/image",
    requireAuth,
    requireRole("ADMIN"),
    uploadSingle("image"),
    handleMulterError,
    validate({ params: photoIdParamSchema }),
    asyncHandler(replacePhotoImage)
);

// ---------- DELETE ----------
photoRouter.delete(
    "/delete/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: photoIdParamSchema }),
    asyncHandler(deletePhoto)
);

export default photoRouter;
// src/routes/blog.routes.ts
import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/errorHandler.js";


import {
    createBlog,
    listBlogs,
    getBlogById,
    updateBlog,
    replaceBlogImage,
    deleteBlog,
} from "../controllers/blog.controller.js";
import { blogIdParamSchema, createBlogSchema, listBlogQuerySchema, updateBlogSchema } from "../validators/blog.js";
import { handleMulterError, uploadSingle } from "../middleware/upload.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const blogRouter = Router();

// ---------- LIST ----------
blogRouter.get(
    "/list-blog",
    validate({ query: listBlogQuerySchema }),
    asyncHandler(listBlogs)
);

// ---------- CREATE (multipart/form-data, field: "image") ----------
blogRouter.post(
    "/create-blog",
    requireAuth,
    requireRole("ADMIN"),
    uploadSingle("image"),
    handleMulterError,
    validate({ body: createBlogSchema }),
    asyncHandler(createBlog)
);

// ---------- GET BY ID ----------
blogRouter.get(
    "/single-blog/:id",
    validate({ params: blogIdParamSchema }),
    asyncHandler(getBlogById)
);

// ---------- UPDATE METADATA (JSON) ----------
blogRouter.patch(
    "/update/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: blogIdParamSchema, body: updateBlogSchema }),
    asyncHandler(updateBlog)
);

// ---------- REPLACE IMAGE (multipart) ----------
blogRouter.patch(
    "/replace/:id/image",
    uploadSingle("image"),
    handleMulterError,
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: blogIdParamSchema }),
    asyncHandler(replaceBlogImage)
);

// ---------- DELETE ----------
blogRouter.delete(
    "/delete/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: blogIdParamSchema }),
    asyncHandler(deleteBlog)
);

export default blogRouter;
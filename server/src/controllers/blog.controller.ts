// src/controllers/blog.controller.ts
import type { Request, Response } from "express";
import { Blog } from "../models/Blog.js";
import { CloudinaryService } from "../utils/cloudinery.service.js";
import { CLOUDINARY_FOLDERS } from "../constants/folders.js";
import { blogIdParamSchema, createBlogSchema, listBlogQuerySchema, updateBlogSchema } from "../validators/blog.js";


// ---------- CREATE (multipart/form-data, field: "image") ----------
export const createBlog = async (req: Request, res: Response) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "Blog image is required." });
    }

    const data = createBlogSchema.parse(req.body);

    const { url, publicId } = await CloudinaryService.uploadBuffer(
        req.file.buffer,
        CLOUDINARY_FOLDERS.BLOG
    );

    const blog = await Blog.create({
        ...data,
        blogImage: url,
        blogImagePublicId: publicId,
    });

    return res.status(201).json({
        success: true,
        message: "Blog created successfully.",
        data: blog,
    });
};

// ---------- LIST ----------
export const listBlogs = async (req: Request, res: Response) => {
    const { search, status, author, from, to, page, limit } =
        listBlogQuerySchema.parse(req.query);

    const filter: Record<string, any> = {};

    if (status !== "All") filter.status = status;
    if (author) filter.author = new RegExp(`^${author.trim()}$`, "i");

    // date range
    if (from || to) {
        filter.postDate = {};
        if (from) filter.postDate.$gte = from;
        if (to) filter.postDate.$lte = to;
    }

    // text search — title + shortIntroduction + article
    if (search && search.trim()) {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [
            { title: regex },
            { shortIntroduction: regex },
            { article: regex },
            { author: regex },
        ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
        Blog.find(filter)
            .sort({ postDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Blog.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: "Blogs fetched successfully.",
        data: blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
        filters: {
            search: search || null,
            status,
            author: author || null,
            from: from ?? null,
            to: to ?? null,
        },
    });
};

// ---------- GET BY ID ----------
export const getBlogById = async (req: Request, res: Response) => {
    const { id } = blogIdParamSchema.parse(req.params);
    const blog = await Blog.findById(id).lean();
    if (!blog) {
        return res
            .status(404)
            .json({ success: false, message: "Blog not found." });
    }
    return res.status(200).json({ success: true, data: blog });
};

// ---------- UPDATE METADATA (JSON, no file) ----------
export const updateBlog = async (req: Request, res: Response) => {
    const { id } = blogIdParamSchema.parse(req.params);
    const data = updateBlogSchema.parse(req.body);

    const blog = await Blog.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).lean();

    if (!blog) {
        return res
            .status(404)
            .json({ success: false, message: "Blog not found." });
    }

    return res.status(200).json({
        success: true,
        message: "Blog updated successfully.",
        data: blog,
    });
};

// ---------- REPLACE IMAGE (multipart/form-data, field: "image") ----------
export const replaceBlogImage = async (req: Request, res: Response) => {
    const { id } = blogIdParamSchema.parse(req.params);

    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "New blog image is required." });
    }

    const existing = await Blog.findById(id);
    if (!existing) {
        return res
            .status(404)
            .json({ success: false, message: "Blog not found." });
    }

    // Upload first, then delete old — protects against failed uploads
    const { url, publicId } = await CloudinaryService.updateImage(
        existing.blogImage,
        req.file.buffer,
        CLOUDINARY_FOLDERS.BLOG
    );

    existing.blogImage = url;
    existing.blogImagePublicId = publicId;
    await existing.save();

    return res.status(200).json({
        success: true,
        message: "Blog image replaced successfully.",
        data: existing,
    });
};

// ---------- DELETE ----------
export const deleteBlog = async (req: Request, res: Response) => {
    const { id } = blogIdParamSchema.parse(req.params);

    const blog = await Blog.findByIdAndDelete(id).lean();
    if (!blog) {
        return res
            .status(404)
            .json({ success: false, message: "Blog not found." });
    }

    // Fire-and-forget; CloudinaryService.deleteImage never throws
    await CloudinaryService.deleteImage(blog.blogImagePublicId);

    return res
        .status(200)
        .json({ success: true, message: "Blog deleted successfully." });
};
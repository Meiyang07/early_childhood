import type { Request, Response } from "express";
import { CLOUDINARY_FOLDERS } from "../constants/folders.js";
import { Photo } from "../models/Photo.model.js";
import { CloudinaryService } from "../utils/cloudinery.service.js";
import { createPhotoSchema, listPhotoQuerySchema, photoIdParamSchema, updatePhotoSchema } from "../validators/photo.js";


// ---------- CREATE ----------
export const createPhoto = async (req: Request, res: Response) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "Image file is required." });
    }

    const data = createPhotoSchema.parse(req.body);

    const { url, publicId } = await CloudinaryService.uploadBuffer(
        req.file.buffer,
        CLOUDINARY_FOLDERS.GALLERY
    );

    const photo = await Photo.create({
        ...data,
        image: url,
        imagePublicId: publicId,
    });

    return res.status(201).json({
        success: true,
        message: "Photo created successfully.",
        data: photo,
    });
};

// ---------- LIST ----------
export const listPhotos = async (req: Request, res: Response) => {
    const { search, category, status, page, limit } =
        listPhotoQuerySchema.parse(req.query);

    const filter: Record<string, any> = {};

    if (category !== "All") filter.category = category;
    if (status !== "All") filter.status = status;

    if (search && search.trim()) {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ title: regex }, { imageDescription: regex }];
    }

    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
        Photo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Photo.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: "Photos fetched successfully.",
        data: photos,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
        filters: { search: search || null, category, status },
    });
};

// ---------- GET BY ID ----------
export const getPhotoById = async (req: Request, res: Response) => {
    const { id } = photoIdParamSchema.parse(req.params);
    const photo = await Photo.findById(id).lean();
    if (!photo) {
        return res
            .status(404)
            .json({ success: false, message: "Photo not found." });
    }
    return res.status(200).json({ success: true, data: photo });
};

// ---------- UPDATE (metadata only) ----------
export const updatePhoto = async (req: Request, res: Response) => {
    const { id } = photoIdParamSchema.parse(req.params);
    const data = updatePhotoSchema.parse(req.body);

    const photo = await Photo.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).lean();

    if (!photo) {
        return res
            .status(404)
            .json({ success: false, message: "Photo not found." });
    }

    return res.status(200).json({
        success: true,
        message: "Photo updated successfully.",
        data: photo,
    });
};

// ---------- REPLACE IMAGE ----------
export const replacePhotoImage = async (req: Request, res: Response) => {
    const { id } = photoIdParamSchema.parse(req.params);

    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "New image file is required." });
    }

    const existing = await Photo.findById(id);
    if (!existing) {
        return res
            .status(404)
            .json({ success: false, message: "Photo not found." });
    }

    // Upload first, then delete old — order protects against failed uploads
    const { url, publicId } = await CloudinaryService.updateImage(
        existing.image,
        req.file.buffer,
        CLOUDINARY_FOLDERS.GALLERY
    );

    existing.image = url;
    existing.imagePublicId = publicId;
    await existing.save();

    return res.status(200).json({
        success: true,
        message: "Photo image replaced successfully.",
        data: existing,
    });
};

// ---------- DELETE ----------
export const deletePhoto = async (req: Request, res: Response) => {
    const { id } = photoIdParamSchema.parse(req.params);

    const photo = await Photo.findByIdAndDelete(id).lean();
    if (!photo) {
        return res
            .status(404)
            .json({ success: false, message: "Photo not found." });
    }

    // Fire-and-forget; CloudinaryService.deleteImage never throws
    await CloudinaryService.deleteImage(photo.imagePublicId);

    return res
        .status(200)
        .json({ success: true, message: "Photo deleted successfully." });
};
// src/controllers/staff.controller.ts
import type { Request, Response } from "express";
import { Staff, type StaffDocument } from "../models/Staff.js";
import { HttpError } from "../middleware/errorHandler.js";
import { CLOUDINARY_FOLDERS } from "../constants/folders.js";
import type { CreateStaffInput, ListStaffQuery } from "../validators/staff.js";
import { CloudinaryService } from "../utils/cloudinery.service.js";
import type { QueryFilter } from "mongoose";



function escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


const ROLE_GROUPS = {
    Admins: "ADMIN",
    Teachers: "TEACHER",
    Operators: "OPERATOR",
} as const;




export async function createStaff(req: Request, res: Response): Promise<void> {


    const { fullName, email, password, role, about, status } =
        req.body as CreateStaffInput;

    const file = req.file;
    if (!file) throw new HttpError(400, "Staff image is required");

    const existing = await Staff.findOne({ email, deletedAt: null }).lean();
    if (existing) {
        throw new HttpError(409, "A staff member with this email already exists");
    }

    const uploaded = await CloudinaryService.uploadBuffer(
        file.buffer,
        CLOUDINARY_FOLDERS.STAFF
    );

    try {
        const passwordHash = await Staff.hashPassword(password);

        const staff = await Staff.create({
            fullName,
            email,
            role,
            about,
            passwordHash,
            image: uploaded.url,
            imagePublicId: uploaded.publicId,
            // Only include `status` when defined, so Mongoose applies `default: "Active"`.
            ...(status !== undefined && { status }),
        });

        res.status(201).json({ success: true, data: staff });
    } catch (err) {
        await CloudinaryService.deleteImage(uploaded.publicId);
        throw err;
    }
}




export async function getAllStaff(req: Request, res: Response): Promise<void> {
    const { search, role, status } = req.query as unknown as ListStaffQuery;

    // ---- Filtered query (what the grid shows) ----
    const filter: QueryFilter<StaffDocument> = { deletedAt: null };

    if (role && role !== "All") {
        const normalized = ROLE_GROUPS[role as keyof typeof ROLE_GROUPS] ?? role;
        filter.role = new RegExp(`^${escapeRegex(normalized)}$`, "i");
    }

    if (status && status !== "All") {
        filter.status = status;
    }

    if (search) {
        const rx = new RegExp(escapeRegex(search), "i");
        filter.$or = [
            { fullName: rx },
            { email: rx },
            { about: rx },
            { role: rx },
        ];
    }

    const [staff, countAgg] = await Promise.all([
        Staff.find(filter)
            .select("-passwordHash -deletedAt")
            .sort({ createdAt: -1 })
            .lean(),
        // Global counts for the tab badges (unaffected by role/status filter)
        Staff.aggregate<{ _id: string; count: number }>([
            { $match: { deletedAt: null } },
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]),
    ]);

    const byRole = countAgg.reduce<Record<string, number>>((acc, c) => {
        acc[c._id] = c.count;
        return acc;
    }, {});

    const counts = {
        All: Object.values(byRole).reduce((a, b) => a + b, 0),
        Admins: byRole.ADMIN ?? 0,
        Teachers: byRole.TEACHER ?? 0,
        Operators: byRole.OPERATOR ?? 0,
    };

    res.status(200).json({
        success: true,
        data: { staff, counts },
    });
}


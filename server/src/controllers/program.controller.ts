import type { NextFunction, Request, Response } from "express";
import { Program } from "../models/Programs.js";
import { createProgramSchema, listProgramQuerySchema, programIdParamSchema, updateProgramSchema } from "../validators/program.js";


// ---------- CREATE ----------
export const createProgram = async (req: Request, res: Response) => {
    const data = createProgramSchema.parse(req.body);
    const program = await Program.create(data);
    return res.status(201).json({
        success: true,
        message: "Program created successfully.",
        data: program,
    });
};




// ---------- LIST ----------
export const listPrograms = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const { search, status, page, limit } =
        listProgramQuerySchema.parse(req.query);

    const filter: Record<string, any> = {};

    if (status !== "All") {
        filter.status = status;
    }

    if (search && search.trim()) {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ name: regex }, { description: regex }];
    }

    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
        Program.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Program.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: "Programs fetched successfully.",
        data: programs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
        filters: { search: search || null, status },
    });
};






// ---------- UPDATE ----------
export const updateProgram = async (req: Request, res: Response) => {
    const { id } = programIdParamSchema.parse(req.params);
    const data = updateProgramSchema.parse(req.body);

    const program = await Program.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).lean();

    if (!program) {
        return res
            .status(404)
            .json({ success: false, message: "Program not found." });
    }

    return res.status(200).json({
        success: true,
        message: "Program updated successfully.",
        data: program,
    });
};




// ---------- DELETE ----------
export const deleteProgram = async (req: Request, res: Response) => {
    const { id } = programIdParamSchema.parse(req.params);
    const program = await Program.findByIdAndDelete(id).lean();
    if (!program) {
        return res
            .status(404)
            .json({ success: false, message: "Program not found." });
    }
    return res
        .status(200)
        .json({ success: true, message: "Program deleted successfully." });
};
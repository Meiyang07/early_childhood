import type { Request, Response, NextFunction } from "express";
import type { QueryFilter } from "mongoose";

import {
    createTestimonialSchema,
    listTestimonialQuerySchema,
    updateTestimonialSchema,
    updateTestimonialStatusSchema,
} from "../validators/testimonial.js";
import Testimonial, { type ITestimonial } from "../models/Testimonials.js";





// ---------- CREATE ----------
export const createTestimonial = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const validatedData = createTestimonialSchema.parse(req.body);

    const testimonial = await Testimonial.create({
        parentName: validatedData.parentName,
        relationship: validatedData.relationship,
        testimonial: validatedData.testimonial,
        rating: validatedData.rating,
        consentToPublish: validatedData.consentToPublish,
        status: "pending",
    });

    return res.status(201).json({
        success: true,
        message: "Testimonial submitted successfully. Awaiting approval.",
        data: testimonial,
    });
};





// ---------- LIST ----------
export const listTestimonials = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const { search, status, page, limit } =
        listTestimonialQuerySchema.parse(req.query);

    const filter: QueryFilter<ITestimonial> = {};

    if (status !== "All") {
        filter.status = status;
    }

    if (search && search.trim()) {
        const escaped = search
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ parentName: regex }, { testimonial: regex }];
    }

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
        Testimonial.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Testimonial.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: "Testimonials fetched successfully.",
        data: testimonials,
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




export const updateTestimonial = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const { id } = req.params;
    const validatedData = updateTestimonialSchema.parse(req.body);

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { $set: validatedData },
        {
            new: true,           // return updated doc
            runValidators: true, // run Mongoose schema validators
        }
    );

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Testimonial updated successfully",
        data: testimonial,
    });
};




// ---------- UPDATE STATUS (admin) ----------
export const updateTestimonialStatus = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const { id } = req.params;
    const { status } = updateTestimonialStatusSchema.parse(req.body);

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
    );

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: `Testimonial status updated to "${status}"`,
        data: testimonial,
    });
};




// ---------- DELETE (admin) ----------
export const deleteTestimonial = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully",
        data: { _id: testimonial._id },
    });
};
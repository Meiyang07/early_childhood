// src/models/photo.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type PhotoCategory =
    | "classroom"
    | "activities"
    | "outdoors"
    | "graduation";

export type PhotoStatus = "draft" | "published";

export interface IPhoto extends Document {
    _id: Types.ObjectId;
    title: string;
    category: PhotoCategory;
    imageDescription: string;
    status: PhotoStatus;
    image: string;            // Cloudinary secure_url
    imagePublicId: string;    // Cloudinary public_id (for deletes / updates)
    createdAt: Date;
    updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>(
    {
        title: {
            type: String,
            required: [true, "Photo title is required"],
            trim: true,
            minlength: [2, "Title must be at least 2 characters"],
            maxlength: [150, "Title cannot exceed 150 characters"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["classroom", "activities", "outdoors", "graduation"],
                message:
                    "Category must be one of: classroom, activities, outdoors, graduation",
            },
            index: true,
        },

        imageDescription: {
            type: String,
            required: [true, "Image description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters"],
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        status: {
            type: String,
            enum: {
                values: ["draft", "published"],
                message: "Status must be either 'draft' or 'published'",
            },
            default: "draft",
            index: true,
        },

        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },

        imagePublicId: {
            type: String,
            required: [true, "Image public ID is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ---------- INDEXES ----------
photoSchema.index({ title: "text", imageDescription: "text" });
photoSchema.index({ status: 1, category: 1, createdAt: -1 });

export const Photo = model<IPhoto>("Photo", photoSchema);
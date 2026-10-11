// src/models/blog.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  postDate: Date;
  author: string;
  shortIntroduction: string;
  article: string;
  status: BlogStatus;
  blogImage: string;          // Cloudinary secure_url
  blogImagePublicId: string;  // Cloudinary public_id
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    postDate: {
      type: Date,
      required: [true, "Post date is required"],
      default: Date.now,
      index: true,
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [2, "Author must be at least 2 characters"],
      maxlength: [100, "Author cannot exceed 100 characters"],
    },

    shortIntroduction: {
      type: String,
      required: [true, "Short introduction is required"],
      trim: true,
      minlength: [10, "Short introduction must be at least 10 characters"],
      maxlength: [500, "Short introduction cannot exceed 500 characters"],
    },

    article: {
      type: String,
      required: [true, "Article is required"],
      trim: true,
      minlength: [50, "Article must be at least 50 characters"],
      maxlength: [50000, "Article cannot exceed 50000 characters"],
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

    blogImage: {
      type: String,
      required: [true, "Blog image URL is required"],
      trim: true,
    },

    blogImagePublicId: {
      type: String,
      required: [true, "Blog image public ID is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ---------- INDEXES ----------
blogSchema.index({ title: "text", shortIntroduction: "text", article: "text" });
blogSchema.index({ status: 1, postDate: -1 });
blogSchema.index({ author: 1 });

export const Blog = model<IBlog>("Blog", blogSchema);
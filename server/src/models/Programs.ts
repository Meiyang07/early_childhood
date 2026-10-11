import { Schema, model, Document, Types } from "mongoose";

// ---------- TYPE ----------
export type ProgramStatus = "published" | "draft";

export interface IProgram extends Document {
  _id: Types.ObjectId;
  name: string;
  ageRange: string;
  classDuration: string;
  noOfTeachers: number;
  noOfChildren: number;
  monthlyFee: number;
  description: string;
  status: ProgramStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- SCHEMA ----------
const programSchema = new Schema<IProgram>(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      minlength: [2, "Program name must be at least 2 characters"],
      maxlength: [120, "Program name cannot exceed 120 characters"],
    },

    ageRange: {
      type: String,
      required: [true, "Age range is required"],
      trim: true,
      maxlength: [50, "Age range cannot exceed 50 characters"],
      // Examples: "2-4 years", "3-5 yrs", "18 months - 3 years"
    },

    classDuration: {
      type: String,
      required: [true, "Class duration is required"],
      trim: true,
      maxlength: [50, "Class duration cannot exceed 50 characters"],
      // Examples: "3 hours", "9:00 AM - 12:00 PM", "Full day"
    },

    noOfTeachers: {
      type: Number,
      required: [true, "Number of teachers is required"],
      min: [1, "At least 1 teacher is required"],
      max: [50, "Number of teachers cannot exceed 50"],
      validate: {
        validator: Number.isInteger,
        message: "Number of teachers must be a whole number",
      },
    },

    noOfChildren: {
      type: Number,
      required: [true, "Number of children is required"],
      min: [1, "At least 1 child is required"],
      max: [500, "Number of children cannot exceed 500"],
      validate: {
        validator: Number.isInteger,
        message: "Number of children must be a whole number",
      },
    },

    monthlyFee: {
      type: Number,
      required: [true, "Monthly fee is required"],
      min: [0, "Monthly fee cannot be negative"],
      max: [1000000, "Monthly fee is too high"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["published", "draft"],
        message: "Status must be either 'published' or 'draft'",
      },
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ---------- INDEXES ----------
programSchema.index({ name: "text", description: "text" });
programSchema.index({ status: 1, createdAt: -1 });
programSchema.index({ monthlyFee: 1 });

// ---------- MODEL ----------
export const Program = model<IProgram>("Program", programSchema);
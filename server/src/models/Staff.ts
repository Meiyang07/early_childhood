// src/models/Staff.ts
import { Schema, model, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { STAFF_STATUSES, type StaffStatus } from "../db/enums.js";

export interface IStaff {
  fullName: string;
  email: string;
  image: string;
  imagePublicId?: string | null;
  passwordHash: string;
  role: string;
  about: string;
  status: StaffStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffDocument extends IStaff, Document<Types.ObjectId> {
  comparePassword(candidate: string): Promise<boolean>;
}

export interface StaffModel extends Model<StaffDocument> {
  hashPassword(plain: string): Promise<string>;
}

const staffSchema = new Schema<StaffDocument, StaffModel>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: null },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    about: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: STAFF_STATUSES as unknown as string[],
      default: "Active",
      index: true,
    },
   
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as any).__v;
        delete (ret as any).passwordHash;
        return ret;
      },
    },
  }
);

// Partial unique index: only enforce uniqueness for non-deleted staff
staffSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

staffSchema.index({ fullName: "text", role: "text", about: "text" });

staffSchema.statics.hashPassword = (plain: string) => bcrypt.hash(plain, 12);
staffSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const Staff = model<StaffDocument, StaffModel>("Staff", staffSchema);
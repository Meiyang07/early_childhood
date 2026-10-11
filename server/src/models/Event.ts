// src/models/event.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type EventStatus = "draft" | "published";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  eventDate: Date;
  time: string;
  location: string;
  details: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },

    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
      maxlength: [100, "Time cannot exceed 100 characters"],
      // Examples: "10:00 AM", "9:00 AM - 12:00 PM", "All day"
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [250, "Location cannot exceed 250 characters"],
    },

    details: {
      type: String,
      required: [true, "Event details are required"],
      trim: true,
      minlength: [10, "Details must be at least 10 characters"],
      maxlength: [3000, "Details cannot exceed 3000 characters"],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ---------- INDEXES ----------
eventSchema.index({ title: "text", details: "text", location: "text" });
eventSchema.index({ status: 1, eventDate: -1 });
eventSchema.index({ status: 1, eventDate: 1 }); // for upcoming published events

export const Event = model<IEvent>("Event", eventSchema);
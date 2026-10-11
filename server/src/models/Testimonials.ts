import { Schema, model,  Model } from "mongoose";

export interface ITestimonial {
    parentName: string;
    relationship: "Father" | "Mother" | "Guardian" | "Other";
    testimonial: string;
    rating: number;
    status: "pending" | "approved" | "rejected";
    consentToPublish: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
    {
        parentName: {
            type: String,
            required: [true, "Parent name is required"],
            trim: true,
            minlength: [2, "Parent name must be at least 2 characters"],
            maxlength: [100, "Parent name cannot exceed 100 characters"],
        },
        relationship: {
            type: String,
            required: [true, "Relationship is required"],
            enum: {
                values: ["Father", "Mother", "Guardian", "Other"],
                message: "Invalid parent relationship",
            },
        },
        testimonial: {
            type: String,
            required: [true, "Testimonial is required"],
            trim: true,
            minlength: [10, "Testimonial must be at least 10 characters"],
            maxlength: [1500, "Testimonial cannot exceed 1500 characters"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number",
            },
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "approved", "rejected"],
                message: "Invalid testimonial status",
            },
            default: "pending",
            required: true,
            index: true,
        },
        consentToPublish: {
            type: Boolean,
            required: [true, "Publication consent is required"],
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
    }
);

// Public testimonial query optimization
testimonialSchema.index({ status: 1, consentToPublish: 1, createdAt: -1 });

// Moderation dashboard queries
testimonialSchema.index({ status: 1, createdAt: -1 });

const Testimonial: Model<ITestimonial>=model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
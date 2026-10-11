import mongoose, { Schema, Document, Model } from 'mongoose';

// --- TypeScript Interfaces ---

export interface IChildInfo {
    fullName: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    applyingForProgram: 'Playgroup' | 'Nursery' | 'Kindergarten' | 'Primary';
    age?: number; // Virtual field
}

export interface IGuardianInfo {
    fullName: string;
    phoneNumber: string;
    email: string;
    homeAddress: string;
}

export interface IAdditionalInfo {
    previousSchool?: string;
    medicalConditions?: string;
    referralSource?: string;
}

export interface IApplication extends Document {
    childInfo: IChildInfo;
    guardianInfo: IGuardianInfo;
    additionalInfo: IAdditionalInfo;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected' | 'Waitlisted';
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// --- Schema Definition ---

const admissionSchema = new Schema<IApplication>({
    // --- Child's Information ---
    childInfo: {
        fullName: {
            type: String,
            required: [true, "Child's full name is required"],
            trim: true,
            maxLength: [100, 'Name cannot exceed 100 characters']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required']
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: {
                values: ['Male', 'Female', 'Other', 'Prefer not to say'],
                message: '{VALUE} is not a supported gender'
            }
        },
        applyingForProgram: {
            type: String,
            required: [true, 'Program selection is required'],
            enum: ['Playgroup', 'Nursery', 'Kindergarten', 'Primary'],
            trim: true
        }
    },

    // --- Parents / Guardian Information ---
    guardianInfo: {
        fullName: {
            type: String,
            required: [true, 'Parent/Guardian name is required'],
            trim: true
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            validate: {
                // Explicitly type 'v' as string
                validator: function (v: string) {
                    return /^\d{10}$/.test(v);
                },
                // Explicitly type 'props' as any or a specific object
                message: (props: any) => `${props.value} is not a valid phone number! Please enter exactly 10 digits.`
            }
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please fill a valid email address'
            ]
        },
        homeAddress: {
            type: String,
            required: [true, 'Home address is required'],
            trim: true
        }
    },

    // --- Additional Information ---
    additionalInfo: {
        previousSchool: {
            type: String,
            trim: true,
            default: ''
        },
        medicalConditions: {
            type: String,
            trim: true,
            default: 'None'
        },
        referralSource: {
            type: String,
            trim: true,
            default: ''
        }
    },

    // --- System Metadata ---
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Waitlisted'],
        default: 'Pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// --- Indexes ---
admissionSchema.index({ 'childInfo.fullName': 'text' });
admissionSchema.index({ 'guardianInfo.email': 1 });

// --- Virtuals ---
admissionSchema.virtual('childInfo.age').get(function (this: IApplication) {
    // Fixes "Object is possibly 'null' or 'undefined'"
    if (!this.childInfo || !this.childInfo.dateOfBirth) return null;

    const diff = Date.now() - this.childInfo.dateOfBirth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// --- Model Export ---
const Admission: Model<IApplication> = mongoose.model<IApplication>('Admission', admissionSchema);

export default Admission;
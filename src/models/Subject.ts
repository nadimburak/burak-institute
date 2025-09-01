// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
    name: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

const SubjectSchema: Schema<ISubject> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Check if model already exists to avoid overwrite errors in Next.js hot reload
const Subject: Model<ISubject> =
    mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;

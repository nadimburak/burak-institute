// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourseType extends Document {
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

const CourseTypeSchema: Schema<ICourseType> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Course type name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: false,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            required:false
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Check if model already exists to avoid overwrite errors in Next.js hot reload
const CourseType: Model<ICourseType> =
    mongoose.models.CourseType || mongoose.model<ICourseType>('CourseType', CourseTypeSchema);

export default CourseType;

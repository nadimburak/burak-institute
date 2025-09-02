// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClasses extends Document {
    name: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

const ClassesSchema: Schema<IClasses> = new Schema(
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
const Classes: Model<IClasses> =
    mongoose.models.Classes || mongoose.model<IClasses>('Classes', ClassesSchema);

export default Classes;

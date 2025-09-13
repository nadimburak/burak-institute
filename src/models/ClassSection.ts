// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClassSection extends Document {
    name: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

const ClassSectionSchema: Schema<IClassSection> = new Schema(
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
        timestamps: false, // Automatically adds createdAt and updatedAt
    }
);

// Check if model already exists to avoid overwrite errors in Next.js hot reload
const ClassSection: Model<IClassSection> =
    mongoose.models.ClassSection || mongoose.model<IClassSection>('ClassSection', ClassSectionSchema);

export default ClassSection;

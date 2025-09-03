// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import Classes from '../classes/classes';

export interface IClassSection extends Document {
    name: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
    class: mongoose.Types.ObjectId[]
}

const ClassSectionSchema: Schema<IClassSection> = new Schema(
    {
        class: [{ type: Schema.Types.ObjectId, ref: Classes, required: false }],
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
const ClassSection: Model<IClassSection> =
    mongoose.models.ClassSection || mongoose.model<IClassSection>('ClassSection', ClassSectionSchema);

export default ClassSection;

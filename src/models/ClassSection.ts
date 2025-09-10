// models/CourseType.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClassSection extends Document {
    name: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
    // classes: mongoose.Types.ObjectId[]
}

const ClassesSchema: Schema<IClassSection> = new Schema(
    {
        //  classes: [{ type: Schema.Types.ObjectId, ref: Classes, required: false }],
        // created_at: {
        //     type: Date,
        //     default: Date.now,
        // },
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
const Classes: Model<IClassSection> =
    mongoose.models.Classes || mongoose.model<IClassSection>('Classes', ClassesSchema);

export default Classes;

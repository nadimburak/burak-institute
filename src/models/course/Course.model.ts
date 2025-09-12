import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
    _id:string,
    subject: mongoose.Types.ObjectId;
    duration: "3 months" | "6 months" | "12 months";
    name: string;
    image: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
    {
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: [true, "Subject is required"],
        },
        duration: {
            type: String,
            enum: ["3 months", "6 months", "12 months"],
            required: [true, "Duration is required"],
        },
        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Course image is required"],
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

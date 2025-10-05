
import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICourseEnquiry extends Document {
    subject: mongoose.Types.ObjectId;
    course?: mongoose.Types.ObjectId;
    description?: string
    name: string
    email: string
}

const CourseEnquirySchema = new Schema<ICourseEnquiry>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: [true, "Subject is required"]
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required"]
    },
    description: {
        type: String
    }
}, { timestamps: true })


const CourseEnquiry: Model<ICourseEnquiry> = mongoose.models.CourseEnquiry || mongoose.model<ICourseEnquiry>("CourseEnquiry", CourseEnquirySchema);

export default CourseEnquiry

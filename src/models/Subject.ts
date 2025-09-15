import mongoose, { Schema, model, models } from "mongoose";

export interface ISubject {
    name: string;
    description?: string;
}

const SubjectSchema = new Schema<ISubject>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

// Prevent re-compiling model on hot-reload
const Subject = models.Subject || model<ISubject>("Subject", SubjectSchema);

export default Subject;

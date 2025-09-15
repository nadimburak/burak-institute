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

const Subject = models.Subject || model<ISubject>("Subject", SubjectSchema);

export default Subject;

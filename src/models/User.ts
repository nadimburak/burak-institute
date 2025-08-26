import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";
import Role from "./Role";
import { Gender } from "../enums/gender";
import { MaritalStatus } from "../enums/maritalStatus";

export type UserType = "user" | "student" | "super_admin";

export interface IUser extends Document {
  role: mongoose.Types.ObjectId;
  name: string;
  mobile?: number;
  image?: string;
  email: string;
  password: string;
  dob: Date;
  spouse_name?: string;
  father_name?: string;
  mother_name?: string;
  status: boolean;
  type: UserType;
  marital_status?: MaritalStatus;
  gender?: Gender;
  language?: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
  toProfileJSON(options?: { includeLanguage?: boolean }): Record<string, unknown>;
}

const UserSchema: Schema<IUser> = new Schema({
  role: { type: Schema.Types.ObjectId, ref: Role, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: false },
  image: { type: String, required: false },
  password: { type: String, required: true },
  spouse_name: { type: String, required: false },
  father_name: { type: String, required: false },
  mother_name: { type: String, required: false },
  dob: {
    type: Date,
    required: false,
  },
  marital_status: {
    type: String,
    enum: Object.values(MaritalStatus),
    required: false,
  },
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: false,
  },
  type: {
    type: String,
    enum: ["user", "student", "super_admin"],
    required: true,
  },
  language: [
    {
      type: Schema.Types.ObjectId,
      ref: "Language",
      required: false,
    },
  ],
  status: { type: Boolean, required: false },
});

// 🔒 Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare password method
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// ✅ Custom dynamic JSON response
UserSchema.methods.toProfileJSON = function (options?: {
  includeLanguage?: boolean;
}) {
  const obj = this.toObject();
  delete obj.password;

  if (!options?.includeLanguage || !obj.language || obj.language.length === 0) {
    delete obj.language;
  }

  return obj;
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;


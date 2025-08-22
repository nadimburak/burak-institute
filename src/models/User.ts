import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    age: number;
    password?: string;
    image?: string;
    emailVerified?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        age: {
            type: Number,
            required: true,
            min: [0, 'Age cannot be negative'],
            max: [150, 'Age cannot be more than 150'],
        },
        password: {
            type: String,
            select: false,
        },
        image: {
            type: String,
        },
        emailVerified: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
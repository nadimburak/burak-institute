import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

interface Params {
    params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const user: IUser | null = await User.findById(params.id);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const body = await request.json();

        const user: IUser | null = await User.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const deletedUser: IUser | null = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
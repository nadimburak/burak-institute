import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const users: IUser[] = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const user: IUser = await User.create(body);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
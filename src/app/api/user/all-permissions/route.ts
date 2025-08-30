import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission from '@/models/Permission';

export async function GET() {
    try {
        await connectDB();

        const data = await Permission.find({});

        return NextResponse.json(data);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({  message: errorMessage }, { status: 400 });
    }
}
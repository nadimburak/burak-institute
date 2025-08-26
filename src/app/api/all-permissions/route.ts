import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission from '@/models/Permission';

export async function GET() {
    try {
        await connectDB();

        const data = await Permission.find({});

        return NextResponse.json(data);
    } catch (error) {
        console.error('GET Permission Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch permissions' },
            { status: 500 }
        );
    }
}
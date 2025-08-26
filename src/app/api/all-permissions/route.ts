import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission, { IPermission } from '@/models/Permission';
import { QueryParams } from '@/types/query.params';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const data = await Permission.find({});

        return NextResponse.json({
            data,
        });
    } catch (error) {
        console.error('GET Permission Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch permissions' },
            { status: 500 }
        );
    }
}
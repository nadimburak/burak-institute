import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission, { IPermission } from '@/models/Permission';

interface Params {
    params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const permission: IPermission | null = await Permission.findById(params.id);

        if (!permission) {
            return NextResponse.json({ success: false, error: 'permission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: permission });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const body = await request.json();

        const permission: IPermission | null = await Permission.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!permission) {
            return NextResponse.json({ success: false, error: 'permission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: permission });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const deletedPermission: IPermission | null = await Permission.findByIdAndDelete(params.id);

        if (!deletedPermission) {
            return NextResponse.json({ success: false, error: 'permission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
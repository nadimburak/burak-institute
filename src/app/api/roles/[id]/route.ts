import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role, { IRole } from '@/models/Role';

interface Params {
    params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const role: IRole | null = await Role.findById(params.id);

        if (!role) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(role);
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const body = await request.json();

        const role: IRole | null = await Role.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!role) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: role });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const deletedRole: IRole | null = await Role.findByIdAndDelete(params.id);

        if (!deletedRole) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
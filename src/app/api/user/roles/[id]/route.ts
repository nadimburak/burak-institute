import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role, { IRole } from '@/models/Role';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const role: IRole | null = await Role.findById(id).populate("permissions", "name");

        if (!role) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(role);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await request.json();

        const role: IRole | null = await Role.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!role) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: role });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const deletedRole: IRole | null = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
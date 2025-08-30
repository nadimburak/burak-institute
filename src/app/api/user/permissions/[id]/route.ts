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

        return NextResponse.json(permission);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
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
    } catch (error: unknown) {
        console.log(error);

        // Handle MongoDB validation errors
        if (
            typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            (error as { name: string }).name === 'ValidationError'
        ) {
            const errors =
                'errors' in error
                    ? Object.values((error as { errors: Record<string, { message: string }> }).errors).map((err) => err.message)
                    : [];
            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: number }).code === 11000
        ) {
            return NextResponse.json(
                { error: 'Data already exists' },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
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
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
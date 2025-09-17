
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ClassSection from '@/models/ClassSection';



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const classSection = await ClassSection.findById(id).lean();
        if (!classSection) {
            return NextResponse.json({ error: 'class-Section not found' }, { status: 404 });
        }

        return NextResponse.json({ data: ClassSection });
    } catch (error) {
        console.error('GET Class Section by ID Error:', error);
        return NextResponse.json({ error: 'Failed to fetch class-Section' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await request.json();

        if (body.name && typeof body.name !== 'string') {
            return NextResponse.json({ error: 'Name must be a string' }, { status: 400 });
        }

        const updated = await ClassSection.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return NextResponse.json({ error: 'class-Section not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updated, message: 'class-Section updated successfully' });
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
                { message: 'Validation failed', details: errors },
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
                { message: 'Data already exists' },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await ClassSection.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Class-Section not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'class-Section deleted successfully' });
    } catch (error) {
        console.error('DELETE Class-Section Error:', error);
        return NextResponse.json({ error: 'Failed to delete class-Section' }, { status: 500 });
    }
}

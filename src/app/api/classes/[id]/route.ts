// app/api/course-types/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Classes from '@/models/classes/classes';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const classes= await Classes.findById(id).lean();
        if (!classes) {
            return NextResponse.json({ error: 'class not found' }, { status: 404 });
        }

        return NextResponse.json({ data: classes });
    } catch (error) {
        console.error('GET classes by ID Error:', error);
        return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
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

        const updated = await Classes.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return NextResponse.json({ error: 'class not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updated, message: 'class updated successfully' });
    } catch (error: any) {
        console.error('PUT class Error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        if (error.code === 11000) {
            return NextResponse.json({ error: 'class already exists' }, { status: 409 });
        }

        return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await Classes.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'class not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'class deleted successfully' });
    } catch (error) {
        console.error('DELETE class Error:', error);
        return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
    }
}

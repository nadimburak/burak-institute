import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ClassSection from '../../../../models/ClassSection'; // <-- apna ClassSection model import karo

// ✅ GET single class-section by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const section = await ClassSection.findById(id)
            .populate('class', '_id name') // yaha class ko populate karo
            .lean();

        if (!section) {
            return NextResponse.json({ error: 'Class section not found' }, { status: 404 });
        }

        return NextResponse.json({ data: section });
    } catch (error) {
        console.error('GET class-section by ID Error:', error);
        return NextResponse.json({ error: 'Failed to fetch class-section' }, { status: 500 });
    }
}

// ✅ UPDATE class-section
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
        }).populate('class', '_id name'); // updated response me bhi populate

        if (!updated) {
            return NextResponse.json({ error: 'Class section not found' }, { status: 404 });
        }

        return NextResponse.json({
            data: updated,
            message: 'Class section updated successfully',
        });
    } catch (error: any) {
        console.error('PUT class-section Error:', error);

        if (error?.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { message: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        if (error?.code === 11000) {
            return NextResponse.json({ message: 'Data already exists' }, { status: 409 });
        }

        return NextResponse.json(
            { message: error.message || 'Failed to update class-section' },
            { status: 400 }
        );
    }
}

// ✅ DELETE class-section
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await ClassSection.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Class section not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Class section deleted successfully' });
    } catch (error) {
        console.error('DELETE class-section Error:', error);
        return NextResponse.json({ error: 'Failed to delete class-section' }, { status: 500 });
    }
}

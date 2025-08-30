// app/api/course-types/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CourseType, { ICourseType } from '@/models/CourseType';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const courseType = await CourseType.findById(id).lean();
        if (!courseType) {
            return NextResponse.json({ error: 'Course type not found' }, { status: 404 });
        }

        return NextResponse.json({ data: courseType });
    } catch (error) {
        console.error('GET CourseType by ID Error:', error);
        return NextResponse.json({ error: 'Failed to fetch course type' }, { status: 500 });
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

        const updated = await CourseType.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return NextResponse.json({ error: 'Course type not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updated, message: 'Course type updated successfully' });
    } catch (error: any) {
        console.error('PUT CourseType Error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        if (error.code === 11000) {
            return NextResponse.json({ error: 'Course type already exists' }, { status: 409 });
        }

        return NextResponse.json({ error: 'Failed to update course type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await CourseType.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Course type not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Course type deleted successfully' });
    } catch (error) {
        console.error('DELETE CourseType Error:', error);
        return NextResponse.json({ error: 'Failed to delete course type' }, { status: 500 });
    }
}

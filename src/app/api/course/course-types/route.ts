
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { QueryParams } from '@/types/query.params';
import CourseType, { ICourseType } from '@/models/course/CourseType.model';
import { HydratedDocument } from "mongoose";


export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const queryParams: QueryParams = Object.fromEntries(searchParams.entries());

        const {
            page = "1",
            limit = "10",
            sortBy = "name",
            order = "asc",
            search = "",
        } = queryParams;

        const parsedPage = Math.max(parseInt(page, 10), 1);
        const parsedLimit = Math.max(parseInt(limit, 10), 1);
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

        const query: Record<string, unknown> = {};
        if (search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" };
        }

        const allowedSortFields = ['name', 'createdAt', 'updatedAt'];
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';

        const [data, totalData] = await Promise.all([
            CourseType.find(query)
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(),
            CourseType.countDocuments(query)
        ]);

        return NextResponse.json({
            data,
            total: totalData,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalData / parsedLimit),
            hasNextPage: parsedPage < Math.ceil(totalData / parsedLimit),
            hasPrevPage: parsedPage > 1,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({  message: errorMessage }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
       
        if (!body.name || typeof body.name !== 'string') {
            return NextResponse.json(
                { error: 'Name is required and must be a string' },
                { status: 400 }
            );
        }
        body.status = 'active'
        
        const existing = await CourseType.findOne({ name: body.name });
        if (existing) {
            return NextResponse.json(
                { error: 'Course type already exists' },
                { status: 409 }
            );
        }
         
        console.log(body);
        
        
        
        const courseType:ICourseType =await CourseType.create(body);
        
            console.log(courseType);
        return NextResponse.json(
            {
                data: courseType,
                message: 'Course type created successfully'
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        // console.log(error);

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
        return NextResponse.json({  message: errorMessage }, { status: 400 });
    }
}

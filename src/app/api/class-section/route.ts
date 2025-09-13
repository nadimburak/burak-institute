
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { QueryParams } from '@/types/query.params';
import ClassSection, { IClassSection } from '@/models/ClassSection';



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
            ClassSection.find(query)
            .populate("classes", "name")
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(),
            ClassSection.countDocuments(query)
        ]);

        return NextResponse.json({
            data,
            total: totalData,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalData / parsedLimit),
            hasNextPage: parsedPage < Math.ceil(totalData / parsedLimit),
            hasPrevPage: parsedPage > 1,
        });
    } catch (error) {
        console.error('GET Class-Section Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Class-Section ' },
            { status: 500 }
        );
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

        const existing = await ClassSection.findOne({ name: body.name });
        if (existing) {
            return NextResponse.json(
                { error: 'Classes already exists' },
                { status: 409 }
            );
        }

        const classSection: IClassSection = await ClassSection.create(body);

        return NextResponse.json(
            {
                data: ClassSection,
                message: 'Class-Section created successfully'
            },
            { status: 201 }
        );
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

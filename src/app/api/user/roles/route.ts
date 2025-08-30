import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { QueryParams } from '@/types/query.params';
import Role, { IRole } from '@/models/Role';

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

        // Parse and validate page and limit
        const parsedPage = Math.max(parseInt(page, 10), 1);
        const parsedLimit = Math.max(parseInt(limit, 10), 1);
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

        // Build search query
        const query: Record<string, unknown> = {};
        if (search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                // Add more fields if needed: { description: { $regex: search.trim(), $options: "i" } }
            ];
        }

        // Validate sortBy field to prevent injection attacks
        const allowedSortFields = ['name', 'createdAt', 'updatedAt']; // Add other allowed fields
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';

        // Execute queries in parallel for better performance
        const [data, totalData] = await Promise.all([
            Role.find(query)
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(), // Use lean() for better performance
            Role.countDocuments(query)
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

        // Basic validation
        if (!body.name || typeof body.name !== 'string') {
            return NextResponse.json(
                { error: 'Name is required and must be a string' },
                { status: 400 }
            );
        }

        // Check if role already exists
        const existingRole = await Role.findOne({
            name: body.name,
            roles: body.roles,
        });

        if (existingRole) {
            return NextResponse.json(
                { error: 'role already exists' },
                { status: 409 }
            );
        }

        const role: IRole = await Role.create(body);

        return NextResponse.json(
            {
                data: role,
                message: 'role created successfully'
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
        return NextResponse.json({  message: errorMessage }, { status: 400 });
    }
}
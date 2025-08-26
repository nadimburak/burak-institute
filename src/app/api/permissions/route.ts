import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission, { IPermission } from '@/models/Permission';

interface QueryParams {
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: string;
    search?: string;
}

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
        const query: any = {};
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
            Permission.find(query)
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(), // Use lean() for better performance
            Permission.countDocuments(query)
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
        console.error('GET Permission Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch permissions' },
            { status: 500 }
        );
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

        // Check if permission already exists
        const existingPermission = await Permission.findOne({
            name: body.name
        });

        if (existingPermission) {
            return NextResponse.json(
                { error: 'Permission already exists' },
                { status: 409 }
            );
        }

        const permission: IPermission = await Permission.create(body);

        return NextResponse.json(
            {
                data: permission,
                message: 'Permission created successfully'
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST Permission Error:', error);

        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Permission already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create permission' },
            { status: 500 }
        );
    }
}
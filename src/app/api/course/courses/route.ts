import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course, { ICourse } from "@/models/course/Course.model";
import { QueryParams } from "@/types/query.params";

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

        // Parse pagination params
        const parsedPage = Math.max(parseInt(page, 10), 1);
        const parsedLimit = Math.max(parseInt(limit, 10), 1);
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

        // Build search query
        const query: Record<string, unknown> = {};
        if (search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
            ];
        }

        // Allowed sort fields (security)
        const allowedSortFields = ["name", "duration", "createdAt", "updatedAt"];
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";

        // Run queries in parallel
        const [data, totalData] = await Promise.all([
            Course.find(query)
                .populate("subject", "name") // get subject name
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(),
            Course.countDocuments(query),
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
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const course: ICourse = await Course.create(body);

        return NextResponse.json({ success: true, data: course }, { status: 201 });
    } catch (error: unknown) {
        console.error("Create Course Error:", error);

        // Validation errors
        if (
            typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as { name: string }).name === "ValidationError"
        ) {
            const errors =
                "errors" in error
                    ? Object.values(
                        (error as { errors: Record<string, { message: string }> }).errors
                    ).map((err) => err.message)
                    : [];
            return NextResponse.json(
                { message: "Validation failed", details: errors },
                { status: 400 }
            );
        }

        // Duplicate key error
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: number }).code === 11000
        ) {
            return NextResponse.json(
                { message: "Course already exists" },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

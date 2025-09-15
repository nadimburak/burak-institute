import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CourseEnquiry, { CourseEnquiryType } from "@/models/course/CourseEnquriyModel"
import { QueryParams } from "@/types/query.params";
import { success } from "zod";


export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const queryParams: QueryParams = Object.fromEntries(searchParams.entries());

        const { page = "1", limit = "10", order = "asc", search = '', sortBy = 'name' } = queryParams

        const parsedPage = Math.max(parseInt(page, 10), 1);
        const parsedLimit = Math.max(parseInt(limit, 10), 1);
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

        const query: Record<string, unknown> = {}

        if (search?.trim()) {
            query.$of = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $option: 'i' } }
            ]
        }

        const allowedSortFields = ["subject", "courses", "createdAt", "updatedAt"];
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "courses";

        const [data, totalData] = await Promise.all([
            CourseEnquiry.find(query)
                .populate('subject', 'name')
                .populate('courses', 'name')
                .populate('user', 'name')
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(),
            CourseEnquiry.countDocuments(query)
        ])
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
        await connectDB()

        const body = await request.json();

        const courseEnquiry: CourseEnquiryType = await CourseEnquiry.create(body)

        if (!courseEnquiry) {
            return NextResponse.json({ success: false, message: "Something went worng while Creating entry in DB on Courseenquiry!!!" })
        }

        return NextResponse.json({ success: true, data: { courseEnquiry } }, { status: 200 })
    } catch (error: unknown) {
        console.error("Create CourseEnquiry Error:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as { name: string }).name === "Validation Error"
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
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: number }).code === 11000
        ) {
            return NextResponse.json(
                { message: "CourseEnquiry already exists" },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}
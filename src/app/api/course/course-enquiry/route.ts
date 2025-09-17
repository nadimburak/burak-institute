// file: app/api/course/course-enquiry/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CourseEnquiry from "@/models/course/CourseEnquriyModel";
import { Types } from "mongoose";
import { z } from "zod"; // ✅ Zod ko import karein

// ✅ FIX 1: Zod ka istemal karke ek validation schema banayein
const courseEnquirySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    
    // ✅ FIX: Ab 'mongoose.Types' ki jagah seedhe 'Types' ka istemal karein
    subject: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid Subject ID format",
    }),
    courses: z.string(),
    description: z.string().optional(),
});

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "name";
        const order = searchParams.get("order") || "asc";

        const parsedPage = Math.max(page, 1);
        const parsedLimit = Math.max(limit, 1);
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

        const query: Record<string, any> = {};

        // ✅ FIX 2: Search query ko theek kiya gaya hai
        if (search.trim()) {
            query.$or = [ // '$of' ko '$or' kiya
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } } // '$option' ko '$options' kiya
            ];
        }

        const allowedSortFields = ["name", "subject", "courses", "createdAt", "updatedAt"];
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";

        const [data, totalData] = await Promise.all([
            CourseEnquiry.find(query)
                .populate('subject', 'name')
                .sort({ [safeSortBy]: sortOrder })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .lean(),
            CourseEnquiry.countDocuments(query)
        ]);

        return NextResponse.json({
            data,
            total: totalData,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalData / parsedLimit),
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: "Error fetching course enquiries", error: errorMessage }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
       console.log(body);
       
        const validatedData = courseEnquirySchema.parse(body);
     
        console.log(validatedData);
        

        const courseEnquiry = await CourseEnquiry.create(validatedData);

       

        return NextResponse.json({ success: true, data: courseEnquiry }, { status: 201 });

    } catch (error: unknown) {
        console.error("💥 UNEXPECTED ERROR IN POST HANDLER:", error); // Debugging ke liye

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid data provided", errors: error},
                { status: 400 }
            );
        }

        if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000) {
            return NextResponse.json(
                { message: "This course enquiry already exists." },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: "An unexpected error occurred.", error: errorMessage }, { status: 500 });
    }
}
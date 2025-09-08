import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course, { ICourse } from "@/models/course/Course.model";

// ✅ GET by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const course: ICourse | null = await Course.findById(params.id)
            .populate("subject", "name")
            .lean();

        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: course });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

// ✅ UPDATE by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();

        const updatedCourse = await Course.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedCourse });
    } catch (error: unknown) {
        console.error(error);

        // Validation error
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

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

// ✅ DELETE by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const deletedCourse = await Course.findByIdAndDelete(params.id);

        if (!deletedCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

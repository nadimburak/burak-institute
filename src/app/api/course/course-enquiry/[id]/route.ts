import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CourseEnquiry, { CourseEnquiryType } from "@/models/course/CourseEnquriyModel"


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const courseenquiry: CourseEnquiryType | null = await CourseEnquiry.findById(params.id)
            .populate('subject', 'name')
            .lean()

        if (!courseenquiry) {
            return NextResponse.json({ message: "Course Enquiry not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: courseenquiry });


    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        await connectDB();
        const body = await request.json();
        const updatedCourseEnquiry = await CourseEnquiry.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCourseEnquiry) {
            return NextResponse.json({ message: "Course Enquiry not found" }, { status: 404 });
        }

         return NextResponse.json({ success: true, data: updatedCourseEnquiry });


    } catch (error:unknown) {
console.error(error);

        // Validation error
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

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    
    }
}

export async function DELETE(
    request:NextRequest,
    {params} : {params: {id : string}}
){
    try {
        await connectDB()

        const deletedCourseEnquiry = await CourseEnquiry.findByIdAndDelete(params.id);

        if(!deletedCourseEnquiry){
            return NextResponse.json({ message: "Course Enquiry not found" }, { status: 404 })
        }
        return NextResponse.json({
                    success: true,
                    message: "Course Enquiry deleted successfully",
                });
        
    } catch (error:unknown) {
         const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}
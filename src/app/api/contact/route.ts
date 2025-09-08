import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/contact/contact.modle"
import { FormData } from "@/components/form/contactForm"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const body = await req.json();

        const { name, email, phone, subject, message } = body as FormData

        if ([name, email, phone, subject, message].some(field => !field || field === "")) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        

        const ContactInfo = (await Contact.create(
            {
                name: name.trim(),
                email: email.trim(),
                phone: phone,
                subject: subject.trim(),
                message: message.trim()
            }
        ));

        if (!ContactInfo) {
      return NextResponse.json(
        { success: false, message: "Failed to save contact information" },
        { status: 500 }
      );
    }

    get(ContactInfo)

         return NextResponse.json(
      {
        success: true,
        message: "Contact info successfully submitted",
        data: ContactInfo.toJSON(),
      },
      { status: 201 }
    );
    } catch (error) {
    console.error("Contact form submission error:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { success: false, message: "Validation error: " + error.message },
          { status: 400 }
        );
      }
      
      if (error.name === "MongoServerError") {
        return NextResponse.json(
          { success: false, message: "Database error" },
          { status: 500 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const get = async function GET(obj: any) {

    if (!obj) {
        return null
    }
    const objJson = obj.toJSON()

    fetch("/dashboard/contact", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objJson),
    })
        .then((res) => res.json())
        .then((data) => console.log("Server Response:", data));

}
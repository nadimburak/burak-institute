import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/contact/contact.modle";
import { FormData } from "@/components/form/contactForm";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const { name, email, phone, subject, message } = body as FormData;

//     // Validation: Required fields
//     if ([name, email, phone, subject, message].some((field) => !field || field === "")) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Validation: Email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid email format" },
//         { status: 400 }
//       );
//     }

//     // Save to DB
//     const contactInfo = await Contact.create({
//       name: name.trim(),
//       email: email.trim(),
//       phone,
//       subject: subject.trim(),
//       message: message.trim(),
//     });

//     if (!contactInfo) {
//       return NextResponse.json(
//         { success: false, message: "Failed to save contact information" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Contact info successfully submitted",
//         data: contactInfo.toJSON(),
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Contact form submission error:", error);

//     if (error instanceof Error) {
//       if (error.name === "ValidationError") {
//         return NextResponse.json(
//           { success: false, message: "Validation error: " + error.message },
//           { status: 400 }
//         );
//       }

//       if (error.name === "MongoServerError") {
//         return NextResponse.json(
//           { success: false, message: "Database error" },
//           { status: 500 }
//         );
//       }
//     }
    

//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first
    return NextResponse.json(
      { success: true, data: contacts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching contacts error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required" },
        { status: 400 }
      );
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

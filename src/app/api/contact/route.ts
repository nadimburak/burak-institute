import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/contact/contact.modle"
import {FormData} from "@/components/form/contactForm"

export async function POST(req:NextRequest){
    try {
        await connectDB()
         const body = await req.json();

        const {name, email, phone, subject, message} = body as FormData

        if([name,email,phone,subject,message].some(field=>field===""))
        {
            throw new Error("All filed Are required!!!!");
        }

       const contactObj:FormData = {
        name,
        email,
        phone,
        subject,
        message
       }

       const ContactInfo = (await Contact.create(contactObj));
       const contactInfo = ContactInfo.toJSON()

      return NextResponse.json(
  {
    success: true,
    message: "Contact info successfully uploaded",
    data: contactInfo,
  },
  { status: 200 }
);
} catch (error) {
        throw error;
    }
}
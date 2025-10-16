import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user/User.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // ✅ Ensure DB connection

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return NextResponse.json({ success: false, message: "Token is expired or invalid!" }, { status: 400 });
    }

    user.isVerified = true;
    user.token = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "User verified successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

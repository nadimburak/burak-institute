import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/user/Role.model'; // Apna Role model import karein

export async function GET() {
  try {
    await connectDB();
    
    // Mongoose ko batayein ki sirf woh documents dhoondhe
    // jahan 'name' ya to 'student' ho ya 'parent'.
    const requiredRoles = await Role.find({ 
      name: { $in: ['student', 'parent'] } 
    }).select('_id name'); // Sirf ID aur naam select karein

    // Agar Mongoose ko kuch nahi milta hai, to woh ek khaali array ([]) bhejta hai,
    // jo ki front-end ke liye perfect hai.
    
    return NextResponse.json(requiredRoles, { status: 200 });

  } catch (error) {
    console.error("Roles fetch karne mein error aaya:", error);
    
    return NextResponse.json(
      { message: 'Server par roles fetch karte samay error aaya' },
      { status: 500 }
    );
  }
}
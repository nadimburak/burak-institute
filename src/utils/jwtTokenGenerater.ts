import User from '@/models/user/User.model'
import jwt from 'jsonwebtoken'

export const generateToken = async(id:string)=>{
    const users = await User.findById(id)
     if (!users) {
    throw new Error("User not found");
  }
   const secret = process.env.JWT_TOKEN_SECRET ;

    if (!secret) {
    throw new Error("JWT secret not defined in environment variables");
  }

   return jwt.sign(
    {
        _id: users?._id
    },
    secret,
     { expiresIn: "7m" } 
    
)
}

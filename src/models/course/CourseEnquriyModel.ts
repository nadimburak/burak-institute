import { required } from "joi"
import mongoose,{Schema,Document,Model} from "mongoose"


export interface CourseEnquiryType extends Document{
    subject:  mongoose.Types.ObjectId;
    courses?:  mongoose.Types.ObjectId;
    description?:string
      username: string
      email:string
}
const CourseEnquirySchema = new Schema<CourseEnquiryType>({

     username: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email:{
        type:String,
        required:[true, "email is required"],
        trim:true,
    },

    subject:{
        type:Schema.Types.ObjectId,
        ref:"Subject",
        required:[true,"Subject is required"]
    },
    courses:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:[true, "Course is required"]
        // required:[true,"Course is required"]
    },
   
    description:{
        type:String
    }
},{timestamps:true})


const CourseEnquiry:Model<CourseEnquiryType> = mongoose.models.CourseEnquiry || mongoose.model<CourseEnquiryType>("CourseEnquiry",CourseEnquirySchema);

export default CourseEnquiry

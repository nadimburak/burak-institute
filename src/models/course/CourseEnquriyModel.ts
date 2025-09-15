import { required } from "joi"
import mongoose,{Schema,Document,Model} from "mongoose"


export interface CourseEnquiryType extends Document{
    subject:  mongoose.Types.ObjectId;
    courses:  mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    description:string
}
const CourseEnquirySchema = new Schema<CourseEnquiryType>({

    subject:{
        type:Schema.Types.ObjectId,
        ref:"Subject",
        required:[true,"Subject is required"]
    },
    courses:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:[true,"Course is required"]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String
    }
},{timestamps:true})


const CourseEnquiry:Model<CourseEnquiryType> = mongoose.models.CourseEnquiry || mongoose.model<CourseEnquiryType>("CourseEnquiry",CourseEnquirySchema);

export default CourseEnquiry

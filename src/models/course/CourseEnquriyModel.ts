import { required } from "joi"
import mongoose,{Schema,Document,Model} from "mongoose"


export interface CourseEnquiryType extends Document{
    subject:  mongoose.Types.ObjectId;
    courses?: string
    description?:string
      name: string;
}
const CourseEnquirySchema = new Schema<CourseEnquiryType>({

     name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    subject:{
        type:Schema.Types.ObjectId,
        ref:"Subject",
        required:[true,"Subject is required"]
    },
    courses:{
        type:String,
        // required:[true,"Course is required"]
    },
   
    description:{
        type:String
    }
},{timestamps:true})


const CourseEnquiry:Model<CourseEnquiryType> = mongoose.models.CourseEnquiry || mongoose.model<CourseEnquiryType>("CourseEnquiry",CourseEnquirySchema);

export default CourseEnquiry

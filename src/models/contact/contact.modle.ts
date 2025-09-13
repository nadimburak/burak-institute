import mongoose,{Schema, Document} from 'mongoose';

interface ContactModel extends Document {
    name:string;
    email:string;
    phone:number;
    subject:string;
    message:string;
}


const ContactSchema: Schema<ContactModel> = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
})


 const Contact = (mongoose.models.ContactModel as mongoose.Model<ContactModel>) || mongoose.model<ContactModel>("ContactModel",ContactSchema)

 export default Contact
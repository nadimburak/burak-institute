
import mongoose, { Schema, Document } from "mongoose";

// Interface for Designation Document
export interface IPermission extends Document {
  name: string;
  status: boolean;
  key:string;
}

// Schema Definition
const PermissionSchema: Schema<IPermission> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    key:{
      type:String,
      required:true,
    },
  },
  
);
PermissionSchema.index({ name: 1 }, { unique: true });
// Model Definition
const Permission =
  mongoose.models.Permission ||
  mongoose.model<IPermission>("Permission", PermissionSchema);


  

export default Permission;

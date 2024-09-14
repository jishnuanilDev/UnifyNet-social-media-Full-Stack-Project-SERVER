import mongoose from "mongoose";
import { Document } from "mongoose";


export interface IAdmin extends Document {
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: String,

  }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;

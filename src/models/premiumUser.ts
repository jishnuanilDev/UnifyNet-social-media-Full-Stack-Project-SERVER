import mongoose from "mongoose";

interface IPremiumUser{
    user:mongoose.Types.ObjectId;
    fullname:string;
    phone:number;
    email:string;
    dateOfBirth:string;
    address:string;
}

const premiumUserSchema = new mongoose.Schema<IPremiumUser>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    fullname:String,
    phone:Number,
    email:{
        type:String,
    },
    dateOfBirth:String,
    address:String


},{ timestamps: true })

const premiumUser = mongoose.model('premiumUser',premiumUserSchema);
export default premiumUser;
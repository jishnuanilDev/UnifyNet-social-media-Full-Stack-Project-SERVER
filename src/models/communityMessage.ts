import mongoose from "mongoose";
import  { Document} from 'mongoose';

interface ICommunityMessage{
  chat:mongoose.Types.ObjectId ;
  community:mongoose.Types.ObjectId ;
  sender: mongoose.Types.ObjectId;
  message: string;
  status: 'seen' | 'delivered';
  timestamp: Date;
  isRead: boolean;
}
const CommunityMessageSchema = new mongoose.Schema<ICommunityMessage>(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: String,
    status :{
      type : String,
      enum : ["seen","delivered"],
      default : "delivered"
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const CommunityMessage = mongoose.model<ICommunityMessage>(
  "CommunityMessage",
  CommunityMessageSchema
);
export default CommunityMessage;

import mongoose from "mongoose";
import  { Document} from 'mongoose';

interface IchatMessage {
  chat:mongoose.Types.ObjectId ;
  community:mongoose.Types.ObjectId ;
  sender: mongoose.Types.ObjectId;
  message: string;
  status: 'seen' | 'delivered';
  timestamp: Date;
  isRead: boolean;
}
const ChatMessageSchema = new mongoose.Schema<IchatMessage>(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
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

const ChatMessage = mongoose.model<IchatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
export default ChatMessage;

import mongoose, {Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>('Chats', chatSchema);

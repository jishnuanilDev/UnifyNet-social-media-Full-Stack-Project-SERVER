import mongoose, { Document } from "mongoose";
interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment: string;
  replies:mongoose.Types.ObjectId[]
  createdAt: Date;
}

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commentReply: String,
  createdAt: { type: Date, default: Date.now },
},
{
    timestamps:true
});
const commentSchema = new mongoose.Schema<IComment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: { type: String, required: true },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
import mongoose, { Document } from "mongoose";
interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment: string;
  replies:mongoose.Types.ObjectId[]
  createdAt: Date;
}

const replySchema = new mongoose.Schema({
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
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
    replies: [{type:mongoose.Schema.Types.ObjectId,ref:'ReplyComment'}],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment",commentSchema);
const ReplyComment = mongoose.model("ReplyComment",replySchema)
export {Comment,ReplyComment};
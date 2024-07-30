import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  caption: string;

  image?: {
    public_id: string;
    url: string;
  };
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];
  reports: {
    user: mongoose.Types.ObjectId;
    report: string;
    createdAt: Date;
  }[];
  isUnlisted:boolean;
  sharedPost?: mongoose.Types.ObjectId;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    caption: String,
    image: {
      public_id: String,
      url: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isUnlisted: { type: Boolean, default: false },
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        report: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sharedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;

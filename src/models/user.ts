import mongoose from "mongoose";
import { Document } from "mongoose";
import Post from "./post";

export interface IUser extends Document {
  username: string;
  fullname: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  isPremium:boolean;
  savedPost: mongoose.Schema.Types.ObjectId[];
  isBlocked: boolean;
  status: string
  profilePic?: string;
  createdAt: Date;
  bio: string;
  followers: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
  updatedAt: Date;
}

interface IPendingUser extends Document {
  fullname: string;
  email: string;
  password: string;
  OTP: string;
  otpExpiresAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: String,
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: String,

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    phone: {
      type: Number,
      unique: true,
    },
    gender: String,
    savedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isBlocked: { type: Boolean, default: false },
    isPremium:{
      type:Boolean,
      default:false
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    profilePic: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const pendingUserSchema = new mongoose.Schema<IPendingUser>({
  fullname: String,
  email: String,
  password: String,
  OTP: String,
  otpExpiresAt: Date,
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
const PendingUser = mongoose.model<IPendingUser>(
  "PendingUser",
  pendingUserSchema
);
export { User, PendingUser };

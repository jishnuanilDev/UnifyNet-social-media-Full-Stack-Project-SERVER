"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingUser = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    isBlocked: { type: Boolean, default: false },
    premium: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    isPremium: {
        type: Boolean,
        default: false,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const pendingUserSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const PendingUser = mongoose_1.default.model("PendingUser", pendingUserSchema);
exports.PendingUser = PendingUser;

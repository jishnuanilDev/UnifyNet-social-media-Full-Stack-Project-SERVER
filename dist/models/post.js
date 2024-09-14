"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    caption: String,
    image: {
        public_id: String,
        url: String,
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }],
    isUnlisted: { type: Boolean, default: false },
    reports: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
postSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;

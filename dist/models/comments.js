"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyComment = exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const replySchema = new mongoose_1.default.Schema({
    comment: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    commentReply: String,
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});
const commentSchema = new mongoose_1.default.Schema({
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: { type: String, required: true },
    replies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ReplyComment' }],
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
const Comment = mongoose_1.default.model("Comment", commentSchema);
exports.Comment = Comment;
const ReplyComment = mongoose_1.default.model("ReplyComment", replySchema);
exports.ReplyComment = ReplyComment;

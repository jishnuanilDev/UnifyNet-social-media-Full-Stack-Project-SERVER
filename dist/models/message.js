"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatMessageSchema = new mongoose_1.default.Schema({
    chat: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: String,
    status: {
        type: String,
        enum: ["seen", "delivered"],
        default: "delivered"
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const ChatMessage = mongoose_1.default.model("ChatMessage", ChatMessageSchema);
exports.default = ChatMessage;

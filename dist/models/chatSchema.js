"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ChatMessage' }],
    lastMessage: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ChatMessage' },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Chat = mongoose_1.default.model('Chats', chatSchema);

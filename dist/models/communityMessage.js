"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommunityMessageSchema = new mongoose_1.default.Schema({
    community: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Community', required: true },
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
const CommunityMessage = mongoose_1.default.model("CommunityMessage", CommunityMessageSchema);
exports.default = CommunityMessage;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const communitySchema = new mongoose_1.default.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    admin: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'CommunityMessage' }],
    lastMessage: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'CommunityMessage' },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});
const Community = mongoose_1.default.model('Community', communitySchema);
exports.default = Community;

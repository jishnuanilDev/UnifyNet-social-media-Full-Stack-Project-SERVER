"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Wishlist = mongoose_1.default.model("Wishlist", wishlistSchema);
exports.default = Wishlist;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const premiumUserSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    fullname: String,
    phone: Number,
    email: {
        type: String,
    },
    dateOfBirth: String,
    address: String
}, { timestamps: true });
const premiumUser = mongoose_1.default.model('premiumUser', premiumUserSchema);
exports.default = premiumUser;

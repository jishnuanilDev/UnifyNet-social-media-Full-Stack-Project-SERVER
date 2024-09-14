"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const razorpay = new razorpay_1.default({
    key_id: 'rzp_test_lyhW5HCWaB5v8H',
    key_secret: 'RhD80WcIktgl89LFIYs0Ff77',
});
exports.default = razorpay;

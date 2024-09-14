"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = void 0;
const otpGenerator = (length) => {
    let otp = "";
    const digits = "0123456789";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * digits.length);
        otp += index;
    }
    return otp;
};
exports.otpGenerator = otpGenerator;

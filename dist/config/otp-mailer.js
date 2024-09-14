"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "jishnuanil255@gmail.com",
        pass: "ytdi bmwq kals piha",
    },
});
function sendMail(email, text) {
    const mailOptions = {
        from: "UnifyNet media",
        to: email,
        subject: "Your OTP for verification",
        text: text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        }
        else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.setTokenCookie = void 0;
const cookie_1 = __importDefault(require("cookie"));
const setTokenCookie = (res, token) => {
    res.setHeader('Set-Cookie', cookie_1.default.serialize('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 5, // 5 days
        sameSite: 'strict',
        path: '/',
    }));
};
exports.setTokenCookie = setTokenCookie;
const logout = (req, res) => {
    res.setHeader('Set-Cookie', cookie_1.default.serialize('userToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Ensure it's secure in production
        maxAge: -1, // Expire the cookie immediately
        sameSite: 'strict',
        path: '/',
    }));
    res.status(200).json({ message: 'Logout successful' });
};
exports.logout = logout;

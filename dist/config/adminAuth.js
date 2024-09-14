"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAdmin = exports.GenerateTokenAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "JISD3VAd";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GenerateTokenAdmin = (adminEmail) => {
    return jsonwebtoken_1.default.sign({ adminEmail }, JWT_SECRET, { expiresIn: "5d" });
};
exports.GenerateTokenAdmin = GenerateTokenAdmin;
const verifyTokenAdmin = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
};
exports.verifyTokenAdmin = verifyTokenAdmin;

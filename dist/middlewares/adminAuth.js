"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
const adminAuth_1 = require("../config/adminAuth");
const admin_1 = __importDefault(require("../models/admin"));
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log(" 2 token missing in admin");
            return res.status(401).json({ info: "Admin authorization token is missing" });
        }
        console.log('admin token', token);
        const decoded = ((0, adminAuth_1.verifyTokenAdmin)(token));
        console.log('decoded admin middleware', decoded);
        const adminEmail = decoded.adminEmail;
        console.log('admin email decoded', adminEmail);
        const admin = yield admin_1.default.find({ adminEmail });
        if (!admin) {
            console.log("3 not find admin ");
            return res.status(401).json({ error: "Invalid token admin" });
        }
        // console.log("4 token get , user passed to request");
        req.admin = admin;
        next();
    }
    catch (err) {
        console.error("Error verifying admin token in middleware:", err);
        return res.status(401).json({ info: "Invalid authorization admin token" });
    }
});
exports.protectAdmin = protectAdmin;

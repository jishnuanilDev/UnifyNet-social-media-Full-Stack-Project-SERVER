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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const userAuth_1 = require("../config/userAuth");
const user_1 = require("../models/user");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("initial state of token request");
        const token = req.headers.authorization;
        if (!token) {
            console.log(" 2 token missing");
            return res.status(401).json({ info: "Authorization token is missing" });
        }
        // console.log("token gotchaaa");
        const decoded = ((0, userAuth_1.verifyToken)(token));
        const userId = decoded.userId;
        const user = yield user_1.User.findById(userId);
        if (!user) {
            // console.log("3 not find user ");
            return res.status(401).json({ error: "Invalid token" });
        }
        // console.log("4 token get , user passed to request");
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Error verifying user token in middleware:", err);
        return res.status(401).json({ info: "Invalid authorization token" });
    }
});
exports.protect = protect;

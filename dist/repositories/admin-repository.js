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
exports.AdminRepository = void 0;
const user_1 = require("../models/user");
const post_1 = __importDefault(require("../models/post"));
const admin_1 = __importDefault(require("../models/admin"));
const premiumUser_1 = __importDefault(require("../models/premiumUser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const comments_1 = require("../models/comments");
const products_1 = __importDefault(require("../models/products"));
class AdminRepository {
    adminFindByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield admin_1.default.find({ email });
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("adminlogin repo", email, password);
                const adminExist = yield this.adminFindByEmail(email);
                if (adminExist) {
                    return adminExist;
                }
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const newAdmin = yield new admin_1.default({
                    email: email,
                    password: hashedPassword,
                });
                yield newAdmin.save();
                console.log("New admin created:", newAdmin);
                return newAdmin;
            }
            catch (err) {
                console.error("error occured during in admin login in admin repository", err);
            }
        });
    }
    fetchAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.User.find({});
            }
            catch (err) {
                console.error("error occured during in fetching users in admin panel", err);
            }
        });
    }
    fetchAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield comments_1.Comment.find({});
            }
            catch (err) {
                console.error("error occured during in fetching users in admin panel", err);
            }
        });
    }
    fetchReportPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_1.default.find({ "reports.0": { $exists: true } })
                    .populate("user", "username")
                    .populate({
                    path: "reports.user",
                    select: "username",
                })
                    .exec();
            }
            catch (err) {
                console.error("Error occurred during fetching reported posts in admin panel", err);
            }
        });
    }
    unlistPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error("Post not found");
                }
                post.isUnlisted = true;
                yield post.save();
            }
            catch (err) {
                console.error("Error occurred during unlisting post", err);
            }
        });
    }
    listPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error("Post not found");
                }
                post.isUnlisted = false;
                yield post.save();
            }
            catch (err) {
                console.error("Error occurred during unlisting post", err);
            }
        });
    }
    fetchPremiumUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield premiumUser_1.default.find({}).populate("user", "username");
            }
            catch (err) {
                console.error("error occured during in fetching users in admin panel", err);
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("user not found for blocking");
                }
                if (user.isBlocked) {
                    yield user_1.User.findByIdAndUpdate(userId, { isBlocked: false });
                    return { status: 200, message: "User unblocked successfully" };
                }
                else {
                    yield user_1.User.findByIdAndUpdate(userId, { isBlocked: true });
                    return { status: 200, message: "User blocked successfully" };
                }
            }
            catch (err) { }
        });
    }
    premiumUserWeeklyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerWeek = yield premiumUser_1.default.aggregate([
                    {
                        $group: {
                            _id: {
                                week: { $week: "$createdAt" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                return usersPerWeek;
            }
            catch (err) {
                console.error("Error occurred in weekly transactions", err);
            }
        });
    }
    premiumUserMonthlyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerWeek = yield premiumUser_1.default.aggregate([
                    {
                        $group: {
                            _id: {
                                month: { $month: "$createdAt" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                return usersPerWeek;
            }
            catch (err) {
                console.error("Error occurred in monthly transactions", err);
            }
        });
    }
    premiumUserYearlyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerWeek = yield premiumUser_1.default.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                return usersPerWeek;
            }
            catch (err) {
                console.error("Error occurred in yearly transactions", err);
            }
        });
    }
    fetchProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield products_1.default.find();
            }
            catch (err) {
                console.error("Error occured in product fetching in user repository", err);
            }
        });
    }
    unlistProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield products_1.default.findById(productId);
                if (!product) {
                    throw new Error("product not found");
                }
                product.isListed = false;
                yield product.save();
            }
            catch (err) {
                console.error("Error occurred during unlisting post", err);
            }
        });
    }
    listProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield products_1.default.findById(productId);
                if (!product) {
                    throw new Error("product not found");
                }
                product.isListed = true;
                yield product.save();
            }
            catch (err) {
                console.error("Error occurred during unlisting post", err);
            }
        });
    }
}
exports.AdminRepository = AdminRepository;

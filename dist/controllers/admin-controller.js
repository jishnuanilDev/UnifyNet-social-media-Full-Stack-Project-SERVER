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
exports.AdminController = void 0;
const SECRET_KEY = "jisd3v";
class AdminController {
    constructor(AdminService) {
        this.AdminService = AdminService;
        this.fetchUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.AdminService.fetchUsers();
                res.status(users.status).json({ users: users.users });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.fetchComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.AdminService.fetchComments();
                res.status(comments.status).json({ comments: comments.comments });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.adminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.AdminService.adminLogin(email, password);
                if (result) {
                    res.status(result.status).json({ message: result.message, adminToken: result.adminToken });
                }
            }
            catch (err) {
                console.error("Error occured in admin login on admin control", err);
            }
        });
        this.fetchReportPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Reported posts server side access it');
                const posts = yield this.AdminService.fetchReportPosts();
                res.status(posts.status).json({ posts: posts.posts });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.unlistPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                console.log('Unlist post with postIld', postId);
                console.log('Reported posts server side access it');
                const result = yield this.AdminService.unlistPost(postId);
                res.status(result.status).json({ message: result.message });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.listPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                console.log('Unlist post with postIld', postId);
                console.log('Reported posts server side access it');
                const result = yield this.AdminService.listPost(postId);
                res.status(result.status).json({ message: result.message });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.getPremiumUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminService.fetchPremiumUsers();
                res.status(result.status).json({ premiumUsers: result.premiumUsers });
            }
            catch (err) {
                console.error("Error occured in fetchUsers in admin control", err);
            }
        });
        this.blockUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const { userId } = req.body;
                const result = yield this.AdminService.blockUser(userId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in user block in admin control", err);
            }
        });
        this.premiumUserWeeklyTransaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminService.premiumUserWeeklyTransaction();
                if (result) {
                    res.status(result.status).json({ data: result.data });
                }
            }
            catch (err) {
                console.error("Error occured in fetch premium user transactions weekly in admin control", err);
            }
        });
        this.premiumUserMonthlyTransaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminService.premiumUserMonthlyTransaction();
                if (result) {
                    res.status(result.status).json({ data: result.data });
                }
            }
            catch (err) {
                console.error("Error occured in fetch premium user transactions monthly in admin control", err);
            }
        });
        this.premiumUserYearlyTransaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminService.premiumUserYearlyTransaction();
                if (result) {
                    res.status(result.status).json({ data: result.data });
                }
            }
            catch (err) {
                console.error("Error occured in fetch premium user transactions monthly in admin control", err);
            }
        });
    }
}
exports.AdminController = AdminController;

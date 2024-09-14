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
exports.AdminService = void 0;
const adminAuth_1 = require("../config/adminAuth");
const SECRET_KEY = "jisd3v";
class AdminService {
    constructor(AdminRepository) {
        this.AdminRepository = AdminRepository;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = {
                    email: "jishnu@gmail.com",
                    password: "jis123",
                };
                if (credentials.email != email) {
                    return { status: 400, message: "Admin not found ", adminToken: '' };
                }
                if (credentials.password != password) {
                    return { status: 400, message: "Inavlid password" };
                }
                const result = yield this.AdminRepository.adminLogin(email, password);
                if (result) {
                    const adminToken = yield (0, adminAuth_1.GenerateTokenAdmin)(credentials.email);
                    if (!adminToken) {
                        console.log("no admin token get in admin service");
                    }
                    return { status: 200, message: "Login successful", adminToken: adminToken };
                }
                return { status: 401, message: "Login failed", adminToken: '' };
            }
            catch (err) {
            }
        });
    }
    fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.AdminRepository.fetchAllUsers();
                if (!users) {
                    return { status: 404, message: "No Users  available" };
                }
                return { status: 200, users: users };
            }
            catch (err) {
                console.error("Error occured in fetching users in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching users in admin service",
                };
            }
        });
    }
    fetchComments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.AdminRepository.fetchAllComments();
                if (!comments) {
                    return { status: 404, message: "No comments  available" };
                }
                return { status: 200, comments: comments };
            }
            catch (err) {
                console.error("Error occured in fetching comments in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching comments in admin service",
                };
            }
        });
    }
    fetchReportPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.AdminRepository.fetchReportPosts();
                if (!posts) {
                    return { status: 404, message: "No posts availale" };
                }
                return { status: 200, posts: posts };
            }
            catch (err) {
                console.error("Error occured in fetching users in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching users in admin service",
                };
            }
        });
    }
    unlistPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.AdminRepository.unlistPost(postId);
                return { status: 200, message: 'Unlisted Successfully' };
            }
            catch (err) {
                console.error("Error occured in fetching users in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching users in admin service",
                };
            }
        });
    }
    listPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.AdminRepository.listPost(postId);
                return { status: 200, message: 'Unlisted Successfully' };
            }
            catch (err) {
                console.error("Error occured in fetching users in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching users in admin service",
                };
            }
        });
    }
    fetchPremiumUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumUsers = yield this.AdminRepository.fetchPremiumUsers();
                if (!premiumUsers) {
                    return { status: 404, message: "No premium users not  available" };
                }
                return { status: 200, premiumUsers: premiumUsers };
            }
            catch (err) {
                console.error("Error occured in fetching premium users in admin service", err);
                return {
                    status: 500,
                    message: "Error occurred during fetching premium users in admin service",
                };
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminRepository.blockUser(userId);
                if (result) {
                    return { status: result.status, message: result.message };
                }
                else {
                    return { status: 401, message: 'Blocking/Unblocking failed' };
                }
            }
            catch (err) {
                console.error("Error occured in blocking and unblocking user in admin service", err);
            }
        });
    }
    premiumUserWeeklyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerWeek = yield this.AdminRepository.premiumUserWeeklyTransaction();
                if (usersPerWeek) {
                    return { status: 200, data: usersPerWeek };
                }
            }
            catch (err) {
                console.error("Error occured in premium users transactions weekly in admin service", err);
            }
        });
    }
    premiumUserMonthlyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerMonth = yield this.AdminRepository.premiumUserMonthlyTransaction();
                if (usersPerMonth) {
                    return { status: 200, data: usersPerMonth };
                }
            }
            catch (err) {
                console.error("Error occured in premium users transactions monthly in admin service", err);
            }
        });
    }
    premiumUserYearlyTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersPerYear = yield this.AdminRepository.premiumUserYearlyTransaction();
                if (usersPerYear) {
                    return { status: 200, data: usersPerYear };
                }
            }
            catch (err) {
                console.error("Error occured in premium users transactions monthly in admin service", err);
            }
        });
    }
}
exports.AdminService = AdminService;

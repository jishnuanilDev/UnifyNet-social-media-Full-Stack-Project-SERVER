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
exports.PostService = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const gemini_1 = require("../config/gemini");
class PostService {
    constructor(PostRespository, UserRepository) {
        this.PostRespository = PostRespository;
        this.UserRepository = UserRepository;
    }
    createPost(email, caption, postImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.UserRepository.findUserByEmail(email);
                if (!user) {
                    return { status: 401, message: "User not exist" };
                }
                const result = yield cloudinary_1.default.uploader.upload(postImage, {
                    folder: "Posts",
                });
                if (result) {
                    const response = yield this.PostRespository.uploadPost(email, caption, result.public_id, result.secure_url);
                    if (response) {
                        return { status: 200, message: "Post Published" };
                    }
                    else {
                        return { status: 401, message: "Post Uploading failed" };
                    }
                }
            }
            catch (err) {
                console.error("Error occured in user upload post in user service", err);
            }
        });
    }
    generateCaption(postImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caption = yield (0, gemini_1.captionGenerate)(postImage);
                console.log('caption generated in user service', caption);
                if (caption) {
                    return { status: 200, caption: caption };
                }
                else {
                    return { status: 401, caption: 'Caption not generated ,please try again' };
                }
            }
            catch (err) {
                console.error("Error occured in user upload post in user service", err);
            }
        });
    }
    fetchPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.PostRespository.fetchPosts();
                if (posts) {
                    return { status: 200, posts: posts };
                }
                else {
                    return { status: 401, message: "Post fetching failed" };
                }
            }
            catch (err) {
                console.error("Error occured in fetchPost in user service", err);
            }
        });
    }
    likePost(postId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.likePost(postId, email);
            }
            catch (err) {
                console.error("Error occured in like post in user service", err);
            }
        });
    }
    unLikePost(postId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.unLikePost(postId, email);
            }
            catch (err) {
                console.error("Error occured in like post in user service", err);
            }
        });
    }
    fetchUserPosts(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.PostRespository.fetchUserPosts(email);
                return { status: 200, posts: posts };
            }
            catch (err) {
                console.error("Error occured in fetch user posts in user service", err);
            }
        });
    }
    fetchUserSavedPosts(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPosts = yield this.PostRespository.fetchUserSavedPosts(email);
                return { status: 200, savedPosts: savedPosts };
            }
            catch (err) {
                console.error("Error occured in fetch user posts in user service", err);
            }
        });
    }
    postComment(userId, comment, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.postComment(userId, comment, postId);
                if (result) {
                    return { status: 200, message: "Comment added" };
                }
                else {
                    return { status: 401, message: "Comment adding failed" };
                }
            }
            catch (err) { }
        });
    }
    reportPost(email, report, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.reportPost(email, report, postId);
                if (result) {
                    return { status: 200, message: "Report Submitted" };
                }
                else {
                    return { status: 401, message: "Report submitting failed" };
                }
            }
            catch (err) { }
        });
    }
    deletePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.deletePost(userId, postId);
                if (result) {
                    return { status: 200, message: result.message };
                }
            }
            catch (err) {
                console.error("Error occured in delete post in user service", err);
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.savePost(userId, postId);
                if (result) {
                    return { status: 200, message: result.message };
                }
            }
            catch (err) {
                console.error("Error occured in delete post in user service", err);
            }
        });
    }
    unsavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.unsavePost(userId, postId);
                if (result) {
                    return { status: 200, message: result.message };
                }
            }
            catch (err) {
                console.error("Error occured in delete post in user service", err);
            }
        });
    }
    replyComment(userId, reply, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRespository.replyComment(userId, reply, commentId);
                if (result) {
                    return { status: 200, message: "Replied Succeed" };
                }
                else {
                    return { status: 401, message: "Reply adding failed" };
                }
            }
            catch (err) { }
        });
    }
}
exports.PostService = PostService;

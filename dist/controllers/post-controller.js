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
exports.PostController = void 0;
class PostController {
    constructor(PostService) {
        this.PostService = PostService;
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { caption, postImage } = req.body;
                const user = req.user;
                const { email } = user;
                const result = yield this.PostService.createPost(email, caption, postImage);
                if (result) {
                    res.status(result === null || result === void 0 ? void 0 : result.status).json({ message: result === null || result === void 0 ? void 0 : result.message });
                }
            }
            catch (err) {
                console.error("Error occured in createPost user controller");
            }
        });
        this.fetchPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostService.fetchPosts();
                if (result) {
                    res.status(result.status).json({ posts: result.posts });
                }
            }
            catch (err) {
                console.error("Error occured in fetchPost user controller");
            }
        });
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const user = req.user;
                const { email } = user;
                console.log("req.body post like", req.body);
                const result = yield this.PostService.likePost(postId, email);
            }
            catch (err) {
                console.error("Error occured in likepost user controller");
            }
        });
        this.unLikePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const user = req.user;
                const { email } = user;
                console.log("req.body post like", req.body);
                const result = yield this.PostService.unLikePost(postId, email);
            }
            catch (err) {
                console.error("Error occured in unLikepost user controller");
            }
        });
        this.fetchUserPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { email } = user;
                const result = yield this.PostService.fetchUserPosts(email);
                if (result) {
                    res.status(result.status).json({ posts: result.posts, user: user });
                }
            }
            catch (err) {
                console.error("Error occured in fetchUserPosts user controller");
            }
        });
        this.fetchUserSavedPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { email } = user;
                const result = yield this.PostService.fetchUserSavedPosts(email);
                if (result) {
                    res.status(result.status).json({ savedPosts: result.savedPosts });
                }
            }
            catch (err) {
                console.error("Error occured in fetchUserPosts user controller");
            }
        });
        this.postComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { comment, postId } = req.body;
                const { _id: userId } = req.user;
                const result = yield this.PostService.postComment(userId, comment, postId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in post comment user controller");
            }
        });
        this.reportPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { report, postId } = req.body;
                const { email } = user;
                const result = yield this.PostService.reportPost(email, report, postId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in post comment user controller");
            }
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.PostService.deletePost(userId, postId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
            }
        });
        this.savePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.PostService.savePost(userId, postId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
            }
        });
        this.unsavePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.PostService.unsavePost(userId, postId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
            }
        });
    }
}
exports.PostController = PostController;

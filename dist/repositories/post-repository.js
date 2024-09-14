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
exports.PostRespository = void 0;
const user_1 = require("../models/user");
const post_1 = __importDefault(require("../models/post"));
const comments_1 = require("../models/comments");
class PostRespository {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }
    uploadPost(email, caption, imgPublicId, imgUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("User not found ");
                }
                const post = new post_1.default({
                    image: {
                        public_id: imgPublicId,
                        url: imgUrl,
                    },
                    caption: caption,
                    user: user._id,
                });
                const newPost = yield post.save();
                user.posts.push(newPost._id);
                return yield user.save();
            }
            catch (err) {
                console.error("Error occured during in uploading user post in user repository", err);
            }
        });
    }
    fetchPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_1.default.find({ isUnlisted: false })
                    .populate("user", "username")
                    .populate({
                    path: "comments",
                    populate: [
                        { path: "user", select: "username" },
                        { path: "replies", populate: { path: "user", select: "username" } },
                    ],
                })
                    .sort({ createdAt: -1 })
                    .exec();
            }
            catch (err) {
                console.error("Error occurred during fetchPosts in repository", err);
                throw new Error("Could not fetch posts");
            }
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_1.default.findById(postId);
            }
            catch (err) {
                console.error("Error occured during find post by id in repository", err);
            }
        });
    }
    likePost(postId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.findPostById(postId);
                const user = yield this.UserRepository.findUserByEmail(email);
                if (post && user) {
                    post.likes.push(user._id);
                    yield post.save();
                }
            }
            catch (err) {
                console.error("Error occured during liking postin repository", err);
            }
        });
    }
    unLikePost(postId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.findPostById(postId);
                const user = yield this.UserRepository.findUserByEmail(email);
                if (post && user) {
                    post.likes = post.likes.filter((like) => !like.equals(user._id));
                    yield post.save();
                }
            }
            catch (err) {
                console.error("Error occured during liking post in repository", err);
            }
        });
    }
    fetchUserPosts(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("User not found ");
                }
                const posts = yield post_1.default.find({ user: user });
                if (posts) {
                    return posts;
                }
                else {
                    return null;
                }
            }
            catch (err) {
                console.error("Error occured during fetching user posts repository", err);
            }
        });
    }
    fetchUserSavedPosts(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("User not found ");
                }
                yield user.populate("savedPost");
                return user.savedPost || [];
            }
            catch (err) {
                console.error("Error occured during fetching user posts repository", err);
            }
        });
    }
    postComment(userId, comment, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const newComment = new comments_1.Comment({
                    post: postId,
                    user: userId,
                    comment: comment,
                });
                const savedComment = yield newComment.save();
                const post = yield post_1.default.findByIdAndUpdate(postId, {
                    $push: { comments: { $each: [savedComment._id], $position: 0 } },
                }, { new: true });
                if (!post) {
                    throw new Error("Post not found");
                }
                return post;
            }
            catch (err) {
                console.error("Error occured during post comment repository", err);
            }
        });
    }
    reportPost(email, report, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("User not found ");
                }
                const post = yield this.findPostById(postId);
                if (!post) {
                    throw new Error("Post not found ");
                }
                const newReport = {
                    user: user._id,
                    report: report,
                    createdAt: new Date(),
                };
                post.reports.unshift(newReport);
                yield post.save();
                return post;
            }
            catch (err) {
                console.error("Error occured during posting post report repository", err);
            }
        });
    }
    deletePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error("Post not found");
                }
                if (post.user.toString() == userId) {
                    yield post_1.default.findByIdAndDelete(postId);
                    return { message: "Post deleted successfully" };
                }
                return { message: "You are not authorized for delete this post" };
                // Delete the post
            }
            catch (err) {
                console.error("Error occurred during deletePost in repository", err);
                throw err; // Propagate the error
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error("Post not found");
                }
                const user = yield user_1.User.findByIdAndUpdate(userId, { $push: { savedPost: postId } }, { new: true });
                if (!user) {
                    throw new Error("User not found");
                }
                // Return success message
                return { message: "Post saved successfully" };
            }
            catch (err) {
                console.error("Error occurred during savePost in repository", err);
                throw err; // Propagate the error
            }
        });
    }
    unsavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    throw new Error("Post not found");
                }
                const user = yield user_1.User.findByIdAndUpdate(userId, { $pull: { savedPost: postId } }, { new: true });
                if (!user) {
                    throw new Error("User not found");
                }
                return { message: "Post unsaved successfully" };
            }
            catch (err) {
                console.error("Error occurred during savePost in repository", err);
                throw err;
            }
        });
    }
    replyComment(userId, reply, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found for reply comment");
                }
                const newReplyComment = new comments_1.ReplyComment({
                    comment: commentId,
                    user: userId,
                    commentReply: reply,
                });
                const savedReply = yield newReplyComment.save();
                const comment = yield comments_1.Comment.findByIdAndUpdate(commentId, {
                    $push: { replies: { $each: [savedReply._id], $position: 0 } },
                }, { new: true });
                if (!comment) {
                    throw new Error("comment not found for add reply");
                }
                return comment;
            }
            catch (err) {
                console.error("Error occured during post comment repository", err);
            }
        });
    }
}
exports.PostRespository = PostRespository;

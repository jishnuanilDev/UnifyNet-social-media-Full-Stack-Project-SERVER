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
exports.UserController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const products_1 = __importDefault(require("../models/products"));
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //login controller
            try {
                const { email, password } = req.body;
                console.log("Login credentials::", email, password);
                const result = yield this.userService.loginData(email, password);
                console.log("token after generated", result.token);
                res.status(result.status).json({
                    message: result.message,
                    userToken: result.token,
                    userIsBlocked: result.userIsBlocked,
                });
            }
            catch (err) {
                console.error("Error occurred in login data", err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //sign-up controller
            const { fullname, email, password } = req.body;
            console.log(fullname, email, password);
            const result = yield this.userService.tempSignUpdata(fullname, email, password);
            res.status(result.status).json({ message: result.message });
        });
        this.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            console.log("initial otp", otp);
            const enteredOtp = otp.join("");
            console.log("enteredOtp:", enteredOtp);
            const verify = yield this.userService.verifyOtp(enteredOtp, email);
            res.status(verify.status).json({ message: verify.message });
        });
        this.createProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, username, phone, bio, gender } = req.body;
                const result = yield this.userService.createProfile(email, username, phone, bio, gender);
                console.log(" userToken verifying in after create profile", result.userToken);
                res
                    .status(result.status)
                    .json({ message: result.message, userToken: result.userToken });
            }
            catch (err) {
                console.error("Error occured in create profile in userController", err);
            }
        });
        this.userProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res.status(200).json({ user });
            }
            catch (err) {
                console.error("Error occured in fetching user profile in user controller", err);
            }
        });
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, fullname, bio, image } = req.body;
                const user = req.user;
                const { email } = user;
                const result = yield this.userService.updateProfile(username, fullname, bio, email, image);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in fetching user profile in user controller", err);
            }
        });
        this.updatePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentPass, newPass, confirmNewPass } = req.body;
                const user = req.user;
                console.log(user);
                const { email } = user;
                console.log(email);
                const result = yield this.userService.updatePassword(currentPass, newPass, confirmNewPass, email);
                if (result) {
                    console.log("Password update result:", result.message);
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in updating password in user controller", err);
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log("forgot-passed email", email);
                const result = yield this.userService.forgotPasswordOtp(email);
                if (result)
                    res.status(result.status).json({ message: result.message });
            }
            catch (err) {
                console.log("Error occured in forgot password in user controller", err);
            }
        });
        this.forgotPassswordOtpVerify = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                // const email = req.params.email;
                console.log("initial otp for forgot password", otp);
                const enteredOtp = otp.join("");
                console.log("enteredOtp:", enteredOtp);
                const result = yield this.userService.forgotPassswordOtpVerify(enteredOtp);
                if (result) {
                    res.status(result === null || result === void 0 ? void 0 : result.status).json({ message: result === null || result === void 0 ? void 0 : result.message });
                }
            }
            catch (err) {
                console.error("Error occured in during verify forgot password otp", err);
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Password reset controller working");
                const { userEmail, newPassword } = req.body;
                const result = yield this.userService.resetPassword(userEmail, newPassword);
                if (result)
                    res
                        .status(result === null || result === void 0 ? void 0 : result.status)
                        .json({ message: result === null || result === void 0 ? void 0 : result.message, userToken: result.userToken });
            }
            catch (err) {
                console.error("Error occured in reset password in user controller", err);
            }
        });
        this.searchName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchName } = req.body;
                const result = yield this.userService.searchName(searchName);
                if (result) {
                    res
                        .status(result.status)
                        .json({ message: result.message, users: result.users });
                }
            }
            catch (err) {
                console.error("Error occured in search user in user controller", err);
            }
        });
        this.friendProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.query;
                const result = yield this.userService.fetchFriendProfile(username);
                if (result) {
                    res.status(result.status).json({ user: result.user });
                }
            }
            catch (err) {
                console.error("Error occured in fetching friend profile in user controller", err);
            }
        });
        this.followProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.body;
                const { _id: userId } = req.user;
                const result = yield this.userService.followProfile(userId, username);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in follow profile in user controller", err);
            }
        });
        this.unFollowProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.body;
                const { _id: userId } = req.user;
                const result = yield this.userService.unFollowProfile(userId, username);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unfollow profile in user controller", err);
            }
        });
        this.blueTickProceed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id: userId } = req.user;
                const { fullname, phone, email, dataOfBirth, address } = req.body;
                console.log("user token checking here for blue tick purchase", userId);
                const result = yield this.userService.blueTickProceed(userId, fullname, phone, email, dataOfBirth, address);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in blue tick confirm in user controller", err);
            }
        });
        this.createNewChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { participantId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                console.log("participantId", participantId);
                console.log("userId", userId);
                const result = yield this.userService.createNewChat(userId, participantId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user controller", err);
            }
        });
        this.getConversations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.fetchUserConversations(userId);
                if (result) {
                    res
                        .status(result.status)
                        .json({ chats: result.chats, currentUserId: userId });
                }
            }
            catch (err) {
                console.error("Error occured get converstions in user controller", err);
            }
        });
        this.sendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { chatId, message } = req.body;
                const { _id: userId } = user;
                const result = yield this.userService.sendMessage(userId, chatId, message);
                if (result) {
                    res.status(result.status).json({ savedMessage: result.savedMessage });
                }
            }
            catch (err) {
                console.log("Error occured in sending message in user controller", err);
            }
        });
        this.getMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.body;
                const { _id: userId } = req.user;
                const result = yield this.userService.getMessages(chatId);
                if (result) {
                    res
                        .status(result.status)
                        .json({ chatMessages: result.chatMessages, currentUserId: userId });
                }
            }
            catch (err) {
                console.error("Error occured get messages in user controller", err);
            }
        });
        this.createCommunity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { participantId, communityName } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                console.log("participantId for community", participantId);
                console.log("userId for community", userId);
                const result = yield this.userService.createCommunity(userId, participantId, communityName);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user controller", err);
            }
        });
        this.getCommunities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.fetchCommunities(userId);
                if (result) {
                    res
                        .status(result.status)
                        .json({ communities: result.communities, currentUserId: userId });
                }
            }
            catch (err) {
                console.error("Error occured get converstions in user controller", err);
            }
        });
        this.communitySendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { communityId, message } = req.body;
                const { _id: userId } = user;
                const result = yield this.userService.sendCommunityMessage(userId, communityId, message);
                if (result) {
                    res.status(result.status).json({ savedMessage: result.savedMessage });
                }
            }
            catch (err) {
                console.log("Error occured in sending message in user controller", err);
            }
        });
        this.getCommunityMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hey bro this is check log for get community messages");
                const { communityId } = req.body;
                console.log("communityId for getting messages", communityId);
                const { _id: userId } = req.user;
                const result = yield this.userService.getCommunityMessages(communityId);
                if (result) {
                    res.status(result.status).json({
                        communityChatMessages: result.communityChatMessages,
                        currentUserId: userId,
                    });
                }
            }
            catch (err) {
                console.error("Error occured get messages in user controller", err);
            }
        });
        this.cancelPremium = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.cancelPremium(userId);
                if (result) {
                    res.status(result.status).json({ user: result.user });
                }
            }
            catch (err) { }
        });
        this.editCommunity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId, participantId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.editCommunity(userId, communityId, participantId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user controller", err);
            }
        });
        this.removeUserFromCommunity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("user removing from community function");
                const user = req.user;
                const { memberId, communityId } = req.body;
                const result = yield this.userService.removeUserFromCommunity(memberId, communityId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in remove user from community in user controller", err);
            }
        });
        this.exitCommunity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("user exiting from community ");
                const user = req.user;
                const { communityId } = req.body;
                const { _id: userId } = user;
                const result = yield this.userService.exitCommunity(userId, communityId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in remove user from community in user controller", err);
            }
        });
        this.editCommunityName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityName, communityId } = req.body;
                const result = yield this.userService.editCommunityName(communityName, communityId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in edit community name in user controller", err);
            }
        });
        this.unsendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.body for unsend message", req.body);
                const { messageId, chatId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.unsendMessage(userId, messageId, chatId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.unsendCommunityMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.body for unsend community message", req.body);
                const { messageId, communityId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.unsendCommunityMessage(userId, messageId, communityId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.getNotifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("/get notifications for fetching notifications");
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.fetchNotifications(userId);
                if (result) {
                    res.status(result.status).json({ notifications: result.notifications });
                }
            }
            catch (err) {
                console.error("Error occured get converstions in user controller", err);
            }
        });
        this.ReadNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.body for mark as read notification", req.body);
                const { notificationId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.ReadNotification(userId, notificationId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.clearAllNotifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.clearAllNotifications(userId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.sellNewProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("sell new product reached server....");
                const user = req.user;
                const { _id: userId } = user;
                const { title, price, category, condition, location, description, images, } = req.body;
                console.log("req.body for  new product", title, price, category);
                const imageUploadPromises = images.map((base64Image) => new Promise((resolve, reject) => {
                    // Determine the image type based on the prefix
                    const matches = base64Image.match(/^data:(image\/[^;]+);base64,(.+)$/);
                    if (!matches) {
                        return reject(new Error("Invalid base64 image format"));
                    }
                    const [, mimeType, base64Data] = matches;
                    // Upload to Cloudinary
                    cloudinary_1.default.uploader
                        .upload_stream({
                        folder: "products",
                        resource_type: "image",
                        format: mimeType.split("/")[1],
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    })
                        .end(Buffer.from(base64Data, "base64"));
                }));
                const imageUploadResults = yield Promise.all(imageUploadPromises);
                const imageUrls = imageUploadResults.map((result) => result.secure_url);
                const newProduct = new products_1.default({
                    sellerId: userId,
                    title,
                    price,
                    category,
                    condition,
                    location,
                    description,
                    images: imageUrls,
                });
                yield newProduct.save();
                res.status(201).json({ message: "Product created successfully" });
            }
            catch (err) {
                console.error("Error creating product:", err);
                res
                    .status(500)
                    .json({ error: "An error occurred while creating the product" });
            }
        });
        this.fetchProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.fetchProducts();
                if (result) {
                    res.status(result.status).json({ products: result.products });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.fetchUserLists = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                const result = yield this.userService.fetchUserLists(userId);
                if (result) {
                    res.status(result.status).json({ userLists: result.userLists });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.markAsSold = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { listId } = req.body;
                const { _id: userId } = user;
                const result = yield this.userService.markAsSold(listId);
                if (result) {
                    res.status(result.status).json({ message: result.message, success: result.success });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.fetchReplies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.params;
                console.log('commentID in params for replies f', commentId);
                const result = yield this.userService.fetchReplies(commentId);
                if (result) {
                    res.status(result.status).json({ replies: result.replies });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.addToWishlist = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const user = req.user;
                const { _id: userId } = user;
                console.log('productId for add to wishlist', productId);
                const result = yield this.userService.addToWishlist(productId, userId);
                if (result) {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.fetchUserWishlist = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { _id: userId } = user;
                console.log('fetching user wishlists.....');
                const result = yield this.userService.fetchUserWishlist(userId);
                if (result) {
                    res.status(result.status).json({ userWishlist: result.userWishlist });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
        this.removeFromWishlist = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { listId } = req.body;
                const { _id: userId } = user;
                console.log('remove product wishlists.....');
                const result = yield this.userService.removeFromWishlist(userId, listId);
                if (result) {
                    res.status(result.status).json({ success: result.success });
                }
            }
            catch (err) {
                console.error("Error occured in unsend Message in user controller", err);
            }
        });
    }
}
exports.UserController = UserController;

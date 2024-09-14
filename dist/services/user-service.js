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
exports.UserService = void 0;
const otp_generator_1 = require("../config/otp-generator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_mailer_1 = require("../config/otp-mailer");
const userAuth_1 = require("../config/userAuth");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class UserService {
    constructor(UserRepository, generatedOtp) {
        this.UserRepository = UserRepository;
        this.generatedOtp = generatedOtp;
    }
    loginData(
    //login area
    email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached login data userService");
            const user = yield this.UserRepository.findUserByEmail(email);
            if (!user) {
                return { status: 404, message: "User not found" };
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return { status: 404, message: "Password not match" };
            }
            const token = yield (0, userAuth_1.generateToken)(user._id);
            if (!token) {
                console.log("no token get in user service");
            }
            return {
                status: 200,
                message: "Login successful",
                token: token,
                userIsBlocked: user.isBlocked,
            };
        });
    }
    tempSignUpdata(
    //signUp area
    fullname, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
            const checkUser = yield this.UserRepository.checkUserExist(email);
            if (checkUser) {
                return { status: 409, message: "User already exist" };
            }
            const OTP = (0, otp_generator_1.otpGenerator)(4);
            const text = `Your OTP is:${OTP}. Please use this code to verify your identity.`;
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            (0, otp_mailer_1.sendMail)(email, text);
            console.log("sendMail executed");
            yield this.UserRepository.createPendingUser(fullname, email, hashedPassword, OTP, otpExpiresAt);
            return { status: 201, message: "Pending user created successfully" };
        });
    }
    verifyOtp(enteredOtp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("entered otp checking in user service verifyOTP", enteredOtp);
            const verifyOtp = yield this.UserRepository.verifyOtp(enteredOtp);
            if (!verifyOtp) {
                console.log("not verified");
                return { status: 400, message: " OTP is invalid" };
            }
            if (new Date() > verifyOtp.otpExpiresAt) {
                yield this.UserRepository.deletePendingUser(email);
                return { status: 400, message: "OTP expired" };
            }
            yield this.UserRepository.createUser(enteredOtp);
            yield this.UserRepository.deletePendingUser(email);
            return { status: 201, message: " User created successfully" };
        });
    }
    createProfile(email, username, phone, bio, gender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usernameExist = yield this.UserRepository.findUserByUsername(username);
                if (usernameExist) {
                    return { status: 409, message: "Username already taken" };
                }
                const updatedUser = yield this.UserRepository.createUserProfile(email, username, phone, bio, gender);
                const token = yield (0, userAuth_1.generateToken)(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id);
                if (!token) {
                    console.log("no token get in user service on sign up");
                }
                return {
                    status: 201,
                    message: "User profile created successfully",
                    userToken: token,
                };
            }
            catch (err) {
                console.error("Error occured during creating user profile in user service:", err);
                return {
                    status: 500,
                    message: "Error occurred during creating user profile",
                    userToken: "",
                };
            }
        });
    }
    updateProfile(username, fullname, bio, email, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                const usernameExistUser = yield this.UserRepository.findUserByUsername(username);
                if (usernameExistUser && user) {
                    if (usernameExistUser.username != user.username && usernameExistUser) {
                        return { status: 409, message: "Username already taken" };
                    }
                }
                const result = yield cloudinary_1.default.uploader.upload(image, {
                    folder: "ProfilePic",
                });
                const updatedUser = yield this.UserRepository.updateUserProfile(username, fullname, bio, email, result.secure_url);
                if (updatedUser) {
                    return {
                        status: 201,
                        message: "Upadated your profile",
                    };
                }
                else {
                    return null;
                }
            }
            catch (err) {
                console.error("Error fetching user profile in user service", err);
            }
        });
    }
    updatePassword(currentPass, newPass, confirmNewPass, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    return { status: 404, message: "User not found" };
                }
                const passwordMatch = yield bcrypt_1.default.compare(currentPass, user.password);
                if (!passwordMatch) {
                    return { status: 404, message: "Your old password is incorrect" };
                }
                const saltRounds = 10;
                const hashedPassword = bcrypt_1.default.hashSync(newPass, saltRounds);
                const updatePassword = yield this.UserRepository.updatePassword(hashedPassword, email);
                if (updatePassword) {
                    return { status: 200, message: "User password updated successfully" };
                }
            }
            catch (err) {
                console.error("Error occured in updating password in user service", err);
                return { status: 404, message: "User password updating failed" };
            }
        });
    }
    forgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.findUserByEmail(email);
                if (!user) {
                    console.log("User not found for forgot password");
                    return { status: 404, message: "User not exist" };
                }
                console.log("Hey forgotPasswordOtp got it");
                const OTP = (0, otp_generator_1.otpGenerator)(4);
                const text = `Your OTP is:${OTP}. Please use this code to verify your identity.`;
                // const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
                (0, otp_mailer_1.sendMail)(email, text);
                this.generatedOtp = OTP;
                console.log(" forgot-pass sendMail executed");
                return { status: 201, message: "OTP send successfully" };
            }
            catch (err) {
                console.log("Error occured during in forgot passoword in server", err);
            }
        });
    }
    forgotPassswordOtpVerify(enteredOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("generatedOtp:", this.generatedOtp);
                console.log("EnteredOtp:", enteredOtp);
                if (this.generatedOtp == enteredOtp) {
                    return { status: 200, message: "OTP verified successfully" };
                }
                return { status: 401, message: "OTP is invalid" };
            }
            catch (err) {
                console.error("Error occured during in verify forgot passsword otp", err);
            }
        });
    }
    resetPassword(userEmail, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Password reset user service working");
                const user = yield this.UserRepository.findUserByEmail(userEmail);
                if (!user) {
                    return { status: 401, message: "User not exist" };
                }
                const saltRounds = 10;
                const hashedPassword = bcrypt_1.default.hashSync(newPassword, saltRounds);
                const updatedPassword = yield this.UserRepository.resetPassword(userEmail, hashedPassword);
                if (updatedPassword) {
                    const token = yield (0, userAuth_1.generateToken)(user._id);
                    if (!token) {
                        console.log("no token get in user service");
                    }
                    return {
                        status: 200,
                        message: "Password reseted successfully",
                        userToken: token,
                    };
                }
            }
            catch (err) {
                console.error("Error occured in reseting password in user serrvice", err);
                return { status: 404, message: "Error occured in reseting password" };
            }
        });
    }
    searchName(searchName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.UserRepository.searchName(searchName);
                if (!users) {
                    return { status: 200, message: "No users found", users: null };
                }
                return { status: 200, users: users, message: "" };
            }
            catch (err) {
                console.error("Error occured in search usernames in user service", err);
                return { status: 401, message: "searching users failed" };
            }
        });
    }
    fetchFriendProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.fetchFriendProfile(username);
                return { status: 200, user: user };
            }
            catch (err) {
                console.error("Error occured in fetching friend profile in user service", err);
            }
        });
    }
    followProfile(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.followProfile(userId, username);
                return { status: 200, message: `You Following ${username}` };
            }
            catch (err) {
                console.error("Error occured in follow request in user service", err);
            }
        });
    }
    unFollowProfile(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.unFollowProfile(userId, username);
                return { status: 200, message: `You Unfollowed ${username}` };
            }
            catch (err) {
                console.error("Error occured in follow request in user service", err);
            }
        });
    }
    blueTickProceed(userId, fullname, phone, email, dateOfBirth, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.blueTickProceed(userId, fullname, phone, email, dateOfBirth, address);
                if (result) {
                    return { status: 200, message: "Premium Activated Successfully" };
                }
            }
            catch (err) {
                console.error("Error occured in blue tick confirm in user service", err);
            }
        });
    }
    createNewChat(userId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.createNewChat(userId, participantId);
                if (result) {
                    return { status: 200, message: "Chat Created Successfully" };
                }
                else {
                    return { status: 401, message: "Chat already exist" };
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user service", err);
            }
        });
    }
    fetchUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield this.UserRepository.fetchUserConversations(userId);
                if (chats) {
                    return { status: 200, chats: chats };
                }
            }
            catch (err) {
                console.error("Error occured in get conversations in user service", err);
            }
        });
    }
    sendMessage(userId, chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield this.UserRepository.sendMessage(userId, chatId, message);
                if (savedMessage) {
                    return { status: 200, savedMessage: savedMessage };
                }
                else {
                    return { status: 401, message: "Message not send" };
                }
            }
            catch (err) {
                console.log("error occured in sending message in user service", err);
            }
        });
    }
    getMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatMessages = yield this.UserRepository.getMessages(chatId);
                if (chatMessages) {
                    return { status: 200, chatMessages: chatMessages };
                }
            }
            catch (err) {
                console.log("error occured in get messages in user service", err);
            }
        });
    }
    createCommunity(userId, participantId, communityName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.createCommunity(userId, participantId, communityName);
                if (result) {
                    return { status: 200, message: "community Created Successfully" };
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user service", err);
            }
        });
    }
    fetchCommunities(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const communities = yield this.UserRepository.fetchCommunities(userId);
                if (communities) {
                    return { status: 200, communities: communities };
                }
            }
            catch (err) {
                console.error("Error occured in get conversations in user service", err);
            }
        });
    }
    sendCommunityMessage(userId, communityId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield this.UserRepository.sendCommunityMessage(userId, communityId, message);
                if (savedMessage) {
                    return { status: 200, savedMessage: savedMessage };
                }
                else {
                    return { status: 401, message: "Message not send" };
                }
            }
            catch (err) {
                console.log("error occured in sending message in user service", err);
            }
        });
    }
    getCommunityMessages(communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const communityChatMessages = yield this.UserRepository.getCommunityMessages(communityId);
                if (communityChatMessages) {
                    return { status: 200, communityChatMessages: communityChatMessages };
                }
            }
            catch (err) {
                console.log("error occured in get messages in user service", err);
            }
        });
    }
    cancelPremium(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserRepository.cancelPremium(userId);
                if (user) {
                    return { status: 200, user: user };
                }
            }
            catch (err) {
                console.log("error occured in cancel premium in user service", err);
            }
        });
    }
    editCommunity(userId, communityId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.editCommunity(userId, communityId, participantId);
                if (result) {
                    return { status: 200, message: "community edited Successfully" };
                }
                else {
                    return { status: 401, message: "Member already exist " };
                }
            }
            catch (err) {
                console.error("Error occured in create new chat in user service", err);
            }
        });
    }
    removeUserFromCommunity(memberId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.removeUserFromCommunity(memberId, communityId);
                if (result) {
                    return { status: 200, message: "you removed " };
                }
                else {
                    return { status: 401, message: "Remove failed " };
                }
            }
            catch (err) {
                console.log("error occured in remove user from community in user service", err);
            }
        });
    }
    exitCommunity(userId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.exitCommunity(userId, communityId);
                if (result) {
                    return { status: 200, message: "you exited successfully " };
                }
                else {
                    return { status: 401, message: "Exiting failed " };
                }
            }
            catch (err) {
                console.log("error occured in remove user from community in user service", err);
            }
        });
    }
    editCommunityName(communityName, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.editCommunityName(communityName, communityId);
                if (result) {
                    return { status: 200, message: "Renamed succesfully " };
                }
                else {
                    return { status: 401, message: "Renamed failed " };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    unsendMessage(userId, messageId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.unsendMessage(userId, messageId, chatId);
                return { status: 200, message: "Message Removed " };
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    unsendCommunityMessage(userId, messageId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.unsendCommunityMessage(userId, messageId, communityId);
                return { status: 200, message: " Message Removed " };
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    fetchNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.UserRepository.fetchNotifications(userId);
                if (notifications) {
                    return { status: 200, notifications: notifications };
                }
            }
            catch (err) {
                console.error("Error occured in get conversations in user service", err);
            }
        });
    }
    ReadNotification(userId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.ReadNotification(userId, notificationId);
                if (result) {
                    return { status: 200, message: "Marked as read " };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    clearAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.clearAllNotifications(userId);
                if (result) {
                    return { status: 200, message: "Notifications cleared " };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    fetchProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.UserRepository.fetchProducts();
                if (products) {
                    return { status: 200, products: products };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    fetchUserLists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userLists = yield this.UserRepository.fetchUserLists(userId);
                if (userLists) {
                    return { status: 200, userLists: userLists };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    markAsSold(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.markAsSold(listId);
                if (result) {
                    return { status: 200, message: 'Marked as sold', success: true };
                }
                else {
                    return { status: 401, message: 'Failed to mark as sold ', success: false };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    fetchReplies(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replies = yield this.UserRepository.fetchReplies(commentId);
                if (replies) {
                    return { status: 200, replies: replies };
                }
                else {
                    return { status: 401, replies: null };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    addToWishlist(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.UserRepository.addToWishlist(productId, userId);
                if (result) {
                    return { status: 200, message: result.message };
                }
                else {
                    return { status: 401, message: 'Adding to Wishlist failed' };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    fetchUserWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWishlist = yield this.UserRepository.fetchUserWishlist(userId);
                if (userWishlist) {
                    return { status: 200, userWishlist: userWishlist };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
    removeFromWishlist(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWishlist = yield this.UserRepository.removeFromWishlist(productId, userId);
                if (userWishlist) {
                    return { status: 200, success: true };
                }
            }
            catch (err) {
                console.log("error occured in edit community name in user service", err);
            }
        });
    }
}
exports.UserService = UserService;

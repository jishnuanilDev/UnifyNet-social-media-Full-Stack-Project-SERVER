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
exports.UserRepository = void 0;
const user_1 = require("../models/user");
const chatSchema_1 = require("../models/chatSchema");
const message_1 = __importDefault(require("../models/message"));
const communityMessage_1 = __importDefault(require("../models/communityMessage"));
const communitySchema_1 = __importDefault(require("../models/communitySchema"));
const premiumUser_1 = __importDefault(require("../models/premiumUser"));
const notifications_1 = __importDefault(require("../models/notifications"));
class UserRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached login find email");
                return yield user_1.User.findOne({ email });
            }
            catch (err) {
                console.error("Error finding user email in repository:", err);
                return null;
            }
        });
    }
    checkUserExist(
    // user sign up
    email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.User.findOne({ email });
            }
            catch (err) {
                console.error("Error finding user exist:in repository", err);
            }
        });
    }
    createUser(enteredOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pendingUser = yield user_1.PendingUser.findOne({ OTP: enteredOtp });
                const newUser = new user_1.User({
                    fullname: pendingUser === null || pendingUser === void 0 ? void 0 : pendingUser.fullname,
                    email: pendingUser === null || pendingUser === void 0 ? void 0 : pendingUser.email,
                    password: pendingUser === null || pendingUser === void 0 ? void 0 : pendingUser.password,
                });
                return yield newUser
                    .save()
                    .then((data) => {
                    console.log("newUser data:", data);
                })
                    .catch((err) => {
                    console.log("Error occured in new user save in repository", err);
                });
            }
            catch (err) {
                console.error("Error occured during creating user in repository:", err);
            }
        });
    }
    createPendingUser(fullname, email, password, OTP, otpExpiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pendingUser = new user_1.PendingUser({
                    fullname,
                    email,
                    password,
                    OTP,
                    otpExpiresAt,
                });
                return yield pendingUser.save();
            }
            catch (err) {
                console.error("Error occured during creating pending user in repository:", err);
            }
        });
    }
    verifyOtp(enteredOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.PendingUser.findOne({ OTP: enteredOtp });
            }
            catch (err) {
                console.error("Error occured during OTP verifying:", err);
            }
        });
    }
    deletePendingUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_1.PendingUser.deleteMany({ email });
            }
            catch (err) {
                console.error("Error occured during delete pending user in repository:", err);
            }
        });
    }
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.User.findOne({ username });
            }
            catch (err) {
                console.error("Error finding username exist in repository:", err);
                return null;
            }
        });
    }
    createUserProfile(email, username, phone, bio, gender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findUserByEmail(email);
                if (!user) {
                    throw new Error("User not found for create profile in repository");
                }
                user.username = username;
                user.phone = phone;
                user.bio = bio;
                user.gender = gender;
                yield user.save();
                console.log("User profile updated successfully");
                return user;
            }
            catch (err) {
                console.error("Error occured during creating user profile in user repository:", err);
            }
        });
    }
    updateUserProfile(username, fullname, bio, email, profilePic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findOne({ email });
                if (!user) {
                    throw new Error("User not found for fetch profile in repository");
                }
                user.username = username;
                user.fullname = fullname;
                user.bio = bio;
                user.profilePic = profilePic;
                return yield user.save();
            }
            catch (err) {
                console.error("Error occured during Updating user profile in user repository:", err);
            }
        });
    }
    updatePassword(newPass, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findOne({ email });
                if (!user) {
                    throw new Error("User not found for updating password repository");
                }
                user.password = newPass;
                return yield user.save();
            }
            catch (err) {
                console.error("Error occured during in update password in user repository");
            }
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("userEmail for reseting password:", email);
                const user = yield user_1.User.findOne({ email });
                if (!user) {
                    throw new Error("User not found for updating password repository");
                }
                user.password = newPassword;
                return yield user.save();
            }
            catch (err) {
                console.error("Error occured during in forgot passord check repository", err);
            }
        });
    }
    searchName(searchName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.User.find({
                    username: { $regex: `^${searchName}`, $options: "i" },
                });
                return users;
            }
            catch (err) { }
        });
    }
    fetchFriendProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = user_1.User.findOne({ username }).populate("posts");
                if (!user) {
                    throw new Error("Friend not found ");
                }
                return user;
            }
            catch (err) {
                console.error("Error occured during fetching friend profile repository", err);
            }
        });
    }
    followProfile(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const friendUser = yield user_1.User.findOne({ username });
                if (!friendUser) {
                    throw new Error("Friend not found ");
                }
                friendUser.followers.unshift(user._id);
                yield friendUser.save();
                user.following.unshift(friendUser._id);
                yield user.save();
                return;
            }
            catch (err) {
                console.error("Error occured during follow request in user repository", err);
            }
        });
    }
    unFollowProfile(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const friendUser = yield user_1.User.findOne({ username });
                if (!friendUser) {
                    throw new Error("Friend not found ");
                }
                const idUser = user._id;
                const idFriendUser = friendUser._id;
                friendUser.followers = friendUser.followers.filter((followerId) => followerId.toString() !== idUser.toString());
                yield friendUser.save();
                user.following = user.following.filter((followingId) => followingId.toString() !== idFriendUser.toString());
                yield user.save();
                return;
            }
            catch (err) {
                console.error("Error occured during follow request in user repository", err);
            }
        });
    }
    blueTickProceed(userId, fullname, phone, email, dateOfBirth, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const newPremiumUser = new premiumUser_1.default({
                    user: user._id,
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    dateOfBirth: dateOfBirth,
                    address: address,
                });
                yield newPremiumUser.save();
                user.premium = newPremiumUser._id;
                user.isPremium = true;
                return yield user.save();
            }
            catch (err) {
                console.error("Error occured during blue tick confirm repository", err);
            }
        });
    }
    createNewChat(userId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const chatExist = yield chatSchema_1.Chat.findOne({
                    participants: { $all: [userId, participantId] },
                });
                if (chatExist) {
                    return null;
                }
                const newChat = new chatSchema_1.Chat({
                    participants: [userId, participantId],
                    messages: [],
                    lastMessage: null,
                });
                const savedChat = yield newChat.save();
                return savedChat;
            }
            catch (err) {
                console.error("Error occured during create new chat in  repository", err);
            }
        });
    }
    fetchUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const chats = yield chatSchema_1.Chat.find({
                    participants: userId,
                }).populate("participants", "username");
                return chats;
            }
            catch (err) {
                console.error("Error occured during fetch conversations repository", err);
            }
        });
    }
    sendMessage(userId, chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("chatid display user repository send message", chatId);
                const chat = yield chatSchema_1.Chat.findById(chatId);
                if (!chat) {
                    throw new Error("Chat not found");
                }
                const sender = yield user_1.User.findById(userId);
                if (!sender) {
                    throw new Error("Sender not found");
                }
                const newMessage = new message_1.default({
                    chat: chat._id,
                    sender: sender._id,
                    message: message,
                    status: "delivered",
                });
                yield newMessage.save();
                yield newMessage.populate("sender", "username");
                chat.messages.push(newMessage._id);
                yield chat.save();
                return newMessage;
            }
            catch (err) {
                console.log("Error occured in storing message in user repository", err);
            }
        });
    }
    getMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield chatSchema_1.Chat.findById(chatId.chatId).populate({
                    path: "messages",
                    select: "message createdAt status",
                    populate: {
                        path: "sender",
                        select: "username",
                    },
                });
                if (!chat) {
                    throw new Error("Chat not found");
                }
                return chat.messages;
            }
            catch (err) {
                console.log("Error occured in get all messages in user repository", err);
            }
        });
    }
    createCommunity(userId, participantId, communityName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                // const chatExist = await Chat.findOne({
                //   participants:{$all:[userId,participantId]}
                // })
                // if(chatExist){
                //   return null;
                // }
                const newCommunity = new communitySchema_1.default({
                    name: communityName,
                    participants: [userId, participantId],
                    admin: userId,
                    messages: [],
                    lastMessage: null,
                });
                const savedCommunity = yield newCommunity.save();
                return savedCommunity;
            }
            catch (err) {
                console.error("Error occured during create new chat in  repository", err);
            }
        });
    }
    fetchCommunities(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const communities = yield communitySchema_1.default.find({
                    participants: userId,
                }).populate("participants", "username");
                return communities;
            }
            catch (err) {
                console.error("Error occured during fetch conversations repository", err);
            }
        });
    }
    sendCommunityMessage(userId, communityId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("community display user repository send message", communityId);
                console.log("community display user repository send message MSG", message);
                const community = yield communitySchema_1.default.findById(communityId);
                if (!community) {
                    throw new Error("Chat not found");
                }
                const sender = yield user_1.User.findById(userId);
                if (!sender) {
                    throw new Error("Sender not found");
                }
                const newCommunityMessage = new communityMessage_1.default({
                    community: community === null || community === void 0 ? void 0 : community._id,
                    sender: sender._id,
                    message: message,
                    status: "delivered",
                });
                yield newCommunityMessage.save();
                yield newCommunityMessage.populate("sender", "username");
                community.messages.push(newCommunityMessage._id);
                yield community.save();
                return newCommunityMessage;
            }
            catch (err) {
                console.log("Error occured in storing message in user repository", err);
            }
        });
    }
    getCommunityMessages(communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const community = yield communitySchema_1.default.findById(communityId).populate({
                    path: "messages",
                    select: "message createdAt status",
                    populate: {
                        path: "sender",
                        select: "username",
                    },
                });
                if (!community) {
                    throw new Error("community not found");
                }
                return community.messages;
            }
            catch (err) {
                console.log("Error occured in get all community messages in user repository", err);
            }
        });
    }
    cancelPremium(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("user not found");
                }
                user.isPremium = false;
                const updatePremiumUser = yield premiumUser_1.default.findByIdAndDelete(user.premium);
                user.premium = null;
                return yield user.save();
            }
            catch (err) {
                console.log("Error occured in cancel premium in user repository", err);
            }
        });
    }
    editCommunity(userId, communityId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const community = yield communitySchema_1.default.findById(communityId);
                if (!community) {
                    throw new Error("community not found ");
                }
                if (participantId) {
                    if (!community.participants.includes(participantId)) {
                        community.participants.push(participantId);
                    }
                    else {
                        return null;
                    }
                }
                return yield community.save();
            }
            catch (err) {
                console.error("Error occured during create new chat in  repository", err);
            }
        });
    }
    removeUserFromCommunity(memberId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communitySchema_1.default.findByIdAndUpdate(communityId, {
                    $pull: { participants: memberId },
                }, { new: true });
                if (!updatedCommunity) {
                    throw new Error("Failed to update community");
                }
                return updatedCommunity;
            }
            catch (err) {
                console.error("Error occured in remove user from community in repository", err);
            }
        });
    }
    exitCommunity(userId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communitySchema_1.default.findByIdAndUpdate(communityId, {
                    $pull: { participants: userId },
                }, { new: true });
                if (!updatedCommunity) {
                    throw new Error("Failed to update community");
                }
                return updatedCommunity;
            }
            catch (err) {
                console.error("Error occured in remove user from community in repository", err);
            }
        });
    }
    editCommunityName(communityName, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const community = yield communitySchema_1.default.findByIdAndUpdate(communityId, { name: communityName }, { new: true });
                if (!community) {
                    throw new Error("Community not found.");
                }
                return community;
            }
            catch (err) {
                console.error("Error occured in edit community name in repository", err);
            }
        });
    }
    unsendMessage(userId, messageId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Chat id for delete message', chatId);
                console.log('messageIdfor delete message', messageId);
                const chat = yield chatSchema_1.Chat.findByIdAndUpdate(chatId, { $pull: { messages: messageId } }, { new: true });
                if (!chat) {
                    throw new Error("Chat not found.");
                }
                const chatMsg = yield message_1.default.findByIdAndDelete(messageId);
                if (!chatMsg) {
                    throw new Error("Message not found.");
                }
            }
            catch (err) {
                console.error("Error occured in unsend message user in repository", err);
            }
        });
    }
    unsendCommunityMessage(userId, messageId, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Chat id for delete community message', communityId);
                console.log('messageIdfor delete message', messageId);
                const community = yield communitySchema_1.default.findByIdAndUpdate(communityId, { $pull: { messages: messageId } }, { new: true });
                if (!community) {
                    throw new Error("community not found.");
                }
                const communityMsg = yield communityMessage_1.default.findByIdAndDelete(messageId);
                if (!communityMsg) {
                    throw new Error("communityMsg not found.");
                }
            }
            catch (err) {
                console.error("Error occured in unsend message user in repository", err);
            }
        });
    }
    fetchNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found ");
                }
                const notifications = yield notifications_1.default.find({
                    receiver: userId,
                })
                    .populate("post")
                    .populate("sender", "username")
                    .sort({ createdAt: -1 });
                return notifications;
            }
            catch (err) {
                console.error("Error occured during fetch notificatioins repository", err);
            }
        });
    }
}
exports.UserRepository = UserRepository;

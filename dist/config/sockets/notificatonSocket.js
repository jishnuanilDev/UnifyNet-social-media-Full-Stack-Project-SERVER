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
exports.notificationSocket = void 0;
const socket_io_1 = require("socket.io");
const post_1 = __importDefault(require("../../models/post"));
const user_1 = require("../../models/user");
const notifications_1 = __importDefault(require("../../models/notifications"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = app.listen(9000, () => {
    console.log(`Server running on port 9000 for notification socket`);
});
const notificationSocket = () => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ['GET,POST']
        }
    });
    let activeUsers = [];
    io.on('connection', (socket) => {
        console.log("New client connected in notification socket");
        socket.on("addUser", (newUserId) => {
            console.log("newuser id for notification real time", newUserId);
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({
                    userId: newUserId,
                    socketId: socket.id,
                });
            }
            console.log("socket disconnected in notifications", activeUsers);
            io.emit("getUsersNotification", activeUsers);
        });
        socket.on('sendNotification', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('sendNotification successfully emited', data);
            const { commentText, postId, senderId } = data;
            try {
                const post = yield post_1.default.findById(postId).populate('user'); // Get the post and populate the post owner's details
                const receiverId = post === null || post === void 0 ? void 0 : post.user._id;
                const sender = yield user_1.User.findById(senderId);
                const senderName = sender === null || sender === void 0 ? void 0 : sender.username;
                // Create a new notification
                const notification = new notifications_1.default({
                    type: 'comment',
                    message: `${senderName} commented on your post: "${commentText}"`,
                    sender: senderId,
                    receiver: receiverId,
                    post: postId,
                });
                yield notification.save();
                const user = activeUsers.find((user) => user.userId == receiverId);
                if (user) {
                    console.log('user consolinng in notification socket', user);
                    socket.to(user.socketId).emit('receiveNotification', notification);
                }
                else {
                    console.log('no user found bro... in notification');
                }
            }
            catch (err) {
                console.error('Error sending notification:', err);
            }
        }));
        socket.on('sendNotificationLike', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('sendNotificationLike successfully emited', data);
            const { postId, senderId } = data;
            try {
                const post = yield post_1.default.findById(postId).populate('user'); // Get the post and populate the post owner's details
                const receiverId = post === null || post === void 0 ? void 0 : post.user._id;
                const sender = yield user_1.User.findById(senderId);
                const senderName = sender === null || sender === void 0 ? void 0 : sender.username;
                // Create a new notification
                const notification = new notifications_1.default({
                    type: 'like',
                    message: `${senderName} liked your post`,
                    sender: senderId,
                    receiver: receiverId,
                    post: postId,
                });
                yield notification.save();
                const user = activeUsers.find((user) => user.userId == receiverId);
                if (user) {
                    console.log('user consolinng in notification socket', user);
                    socket.to(user.socketId).emit('receiveNotificationLike', notification);
                }
                else {
                    console.log('no user found bro... in notification');
                }
            }
            catch (err) {
                console.error('Error sending notification:', err);
            }
        }));
        socket.on('followNotification', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('followNotification successfully emited', data);
            const { receiverId, senderId } = data;
            try {
                // Create a new notification
                const sender = yield user_1.User.findById(senderId);
                const senderName = sender === null || sender === void 0 ? void 0 : sender.username;
                const notification = new notifications_1.default({
                    type: 'follow',
                    message: `${senderName} is following you`,
                    sender: senderId,
                    receiver: receiverId,
                });
                yield notification.save();
                const user = activeUsers.find((user) => user.userId == receiverId);
                if (user) {
                    console.log('user consolinng in notification follow socket', user);
                    socket.to(user.socketId).emit('followNotify', notification);
                }
                else {
                    console.log('no user found bro... in notification');
                }
            }
            catch (err) {
                console.error('Error sending notification:', err);
            }
        }));
        socket.on("disconnect", () => {
            console.log("socket disconnected in notifications");
        });
    });
};
exports.notificationSocket = notificationSocket;

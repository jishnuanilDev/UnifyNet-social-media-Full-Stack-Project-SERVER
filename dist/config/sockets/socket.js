"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatInitializeSocket = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
let activeUsers = [];
const server = app.listen(8000, () => {
    console.log(`Server running on port 8000 for chat socket`);
});
const chatInitializeSocket = () => {
    console.log('chat socket working fine');
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    let activeUsers = [];
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("addUser", (newUserId) => {
            console.log("newuser id for real time messaging", newUserId);
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({
                    userId: newUserId,
                    socketId: socket.id,
                });
            }
            console.log("socket disconnected", activeUsers);
            io.emit("getUsers", activeUsers);
        });
        socket.on("sendMessage", (data) => {
            const { receiverId, senderId } = data;
            const user = activeUsers.find((user) => user.userId._id === receiverId._id);
            console.log("sending data from socket io", receiverId);
            console.log("data in send message socket", data);
            console.log("User : ", user);
            if (user) {
                console.log("Recieve message");
                io.to(user.socketId).emit("receiveMessage", data);
            }
        });
        socket.on("typing", (data) => {
            const { recieverId } = data;
            if (recieverId) {
                console.log('yooo partner id in for set typing status', recieverId);
                socket.broadcast.emit("userTyping", recieverId.username);
            }
        });
        socket.on("stopTyping", (data) => {
            const { recieverId } = data;
            if (recieverId) {
                socket.broadcast.emit("userStoppedTyping", recieverId.username);
            }
        });
        socket.on("disconnect", () => {
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("socket disconnected", activeUsers);
        });
        io.emit("getUsers", activeUsers);
    });
    return io;
};
exports.chatInitializeSocket = chatInitializeSocket;

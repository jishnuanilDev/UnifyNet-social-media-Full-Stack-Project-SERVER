"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let activeUsers = [];
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
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
        socket.on("disconnect", () => {
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("socket disconnected", activeUsers);
        });
        io.emit("getUsers", activeUsers);
    });
    return io;
};
exports.initializeSocket = initializeSocket;

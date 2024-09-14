"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRtcSocket = void 0;
const socket_io_1 = require("socket.io");
let activeUsers = [];
const webRtcSocket = (server) => {
    console.log("yeah webrtc working fine");
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    let activeUsers = [];
    io.on("connection", (socket) => {
        console.log("New client connected in webrtc ");
        socket.emit("me", socket.id);
        socket.on("addUser", (username) => {
            console.log("newuser id for real time video calling", username);
            if (!activeUsers.some((user) => user.username === username)) {
                activeUsers.push({
                    username: username,
                    socketId: socket.id,
                });
            }
            console.log("Active users in WebRTC:", activeUsers);
            io.emit("getUsers", activeUsers);
        });
        socket.emit("me", socket.id);
        // socket.on("disconnect", () => {
        //   socket.broadcast.emit("Call Ended");
        // });
        socket.on("callUser", (data) => {
            const user = activeUsers.find((user) => user.username === data.userToCall);
            if (user) {
                console.log("yeah user detected for sending reciever", user.socketId);
                io.to(user.socketId).emit("callUsr", {
                    signal: data.signalData,
                    from: user.socketId,
                    name: data.name,
                });
            }
            else {
                console.log("User not found:", data.userToCall);
            }
        });
        socket.on("answerCall", (data) => {
            console.log('data.to', data);
            io.to(data.to).emit("callAccepted"), data.signal;
        });
        socket.on("endCall", (data) => {
            const user = activeUsers.find((user) => user.username === data.to);
            if (user) {
                console.log("User gotcha for end user", data.to);
                io.to(user.socketId).emit("callEnded");
            }
            else {
                console.log("User not found for end call", data.to);
            }
        });
        // socket.on("disconnect", () => {
        //   console.log("Client disconnected in WebRTC");
        // });
    });
    return io;
};
exports.webRtcSocket = webRtcSocket;

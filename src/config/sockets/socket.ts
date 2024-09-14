import express from "express";
import { Server, Socket } from "socket.io";
const app = express();
interface User {
  userId: string;
  socketId: string;
}

let activeUsers: User[] = [];
const server = app.listen(8000, () => {
  console.log(`Server running on port 8000 for chat socket`);
});
export const chatInitializeSocket = () => {
  console.log('chat socket working fine');
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  interface User {
    userId: string;
    socketId: string;
  }

  let activeUsers: any = [];

  io.on("connection", (socket: Socket) => {
    console.log("New client connected");
    socket.on("addUser", (newUserId: string) => {
      console.log("newuser id for real time messaging", newUserId);
      if (!activeUsers.some((user: any) => user.userId === newUserId)) {
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
      const user = activeUsers.find(
        (user: any) => user.userId._id === receiverId._id
      );
      console.log("sending data from socket io", receiverId);
      console.log("data in send message socket", data);
      console.log("User : ", user);

      if (user) {
        console.log("Recieve message");

        io.to(user.socketId).emit("receiveMessage", data);
      }
    });
    socket.on("typing", (data) => {
     const {recieverId} = data;
     if(recieverId){
      console.log('yooo partner id in for set typing status',recieverId);
      socket.broadcast.emit("userTyping",recieverId.username);
     }
 
    });

    socket.on("stopTyping", (data) => {
      const {recieverId} = data;
      if(recieverId){
        socket.broadcast.emit("userStoppedTyping", recieverId.username);
      }
  
    });
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter(
        (user: any) => user.socketId !== socket.id
      );
      console.log("socket disconnected", activeUsers);
    });

    io.emit("getUsers", activeUsers);
  });

  return io;
};

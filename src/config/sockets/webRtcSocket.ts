import { Server, Socket } from "socket.io";
import express from "express";
const app = express();
interface User {
  userId: string;
  socketId: string;
}

let activeUsers: User[] = [];
const server = app.listen(4000, () => {
  console.log(`Server running on port 4000 for web rtc video socket`);
});
export const webRtcSocket = () => {
  console.log("yeah webrtc working fine");
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  interface User {
    username: string;
    socketId: string;
  }

  let activeUsers: any = [];

  io.on("connection", (socket: Socket) => {
    console.log("New client connected in webrtc ");
    socket.emit("me", socket.id);
    socket.on("addUser", (username: string) => {
      console.log("newuser id for real time video calling", username);
      if (!activeUsers.some((user: any) => user.username === username)) {
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
      const user = activeUsers.find(
        (user: any) => user.username === data.userToCall
      );

      if (user) {
        console.log("yeah user detected for sending reciever",user.socketId);
        io.to(user.socketId).emit("callUsr", {
          signal: data.signalData,
          from: user.socketId,
          name: data.name,
        });
      } else {
        console.log("User not found:", data.userToCall);
      }
    });

    socket.on("answerCall", (data) => {
      console.log('data.to',data);
      io.to(data.to).emit("callAccepted"), data.signal;
    });

    socket.on("endCall", (data) => {
      const user = activeUsers.find((user:any) => user.username === data.to);
      if (user) {
        console.log("User gotcha for end user", data.to);
        // io.to(user.socketId).emit("callEnded");
        socket.broadcast.emit("callEnded");
      }else{
        console.log("User not found for end call", data.to);
      }
    });

    // socket.on("disconnect", () => {
    //   console.log("Client disconnected in WebRTC");
    // });
  });

  return io;
};

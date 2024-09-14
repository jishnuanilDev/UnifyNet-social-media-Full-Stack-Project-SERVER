import { Server, Socket } from "socket.io";
import Post from "../../models/post";
import { User } from "../../models/user";
import Notification from "../../models/notifications";
import express from "express";
const app = express();
const server = app.listen(9000, () => {
  console.log(`Server running on port 9000 for notification socket`);
});
export const notificationSocket = ()=>{
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:3000",
            methods:['GET,POST']
        }
    });
    interface User {
        userId: string;
        socketId: string;
      }
    let activeUsers: any = [];
 io.on('connection',(socket:Socket)=>{
    console.log("New client connected in notification socket");
    socket.on("addUser", (newUserId: string) => {
        console.log("newuser id for notification real time", newUserId);
        if (!activeUsers.some((user: any) => user.userId === newUserId)) {
          activeUsers.push({
            userId: newUserId,
            socketId: socket.id,
          });
        }
        console.log("socket disconnected in notifications", activeUsers);
        io.emit("getUsersNotification", activeUsers);
      });
    socket.on('sendNotification', async (data) => {
        console.log('sendNotification successfully emited',data);
        const { commentText, postId, senderId } = data;
  
        try {
          const post = await Post.findById(postId).populate('user'); // Get the post and populate the post owner's details
          const receiverId = post?.user._id
  const sender = await User.findById(senderId);
const senderName = sender?.username
          // Create a new notification
          const notification = new Notification({
            type: 'comment',
            message: `${senderName} commented on your post: "${commentText}"`,
            sender: senderId,
            receiver: receiverId,
            post: postId,
          });
  
          await notification.save();
          const user = activeUsers.find(
            (user: any) => user.userId==receiverId
          );
          if(user){
            console.log('user consolinng in notification socket',user)
            socket.to(user.socketId).emit('receiveNotification',notification);
          }else{
            console.log('no user found bro... in notification')
          }
         
         
        } catch (err) {
          console.error('Error sending notification:', err);
        }
      });

      socket.on('sendNotificationLike', async (data) => {
        console.log('sendNotificationLike successfully emited',data);
        const {postId, senderId } = data;
  
        try {
          const post = await Post.findById(postId).populate('user'); // Get the post and populate the post owner's details
          const receiverId = post?.user._id
          const sender = await User.findById(senderId);
          const senderName = sender?.username
          // Create a new notification
          const notification = new Notification({
            type: 'like',
            message: `${senderName} liked your post`,
            sender: senderId,
            receiver: receiverId,
            post: postId,
          });
  
          await notification.save();
          const user = activeUsers.find(
            (user: any) => user.userId==receiverId
          );
          if(user){
            console.log('user consolinng in notification socket',user)
            socket.to(user.socketId).emit('receiveNotificationLike',notification);
          }else{
            console.log('no user found bro... in notification')
          }
         
         
        } catch (err) {
          console.error('Error sending notification:', err);
        }
      });

      socket.on('followNotification', async (data) => {
        console.log('followNotification successfully emited',data);
        const {receiverId,senderId } = data;
  
        try {
          // Create a new notification
          const sender = await User.findById(senderId);
          const senderName = sender?.username
          const notification = new Notification({
            type: 'follow',
            message: `${senderName} is following you`,
            sender: senderId,
            receiver: receiverId,
          });
  
          await notification.save();
          const user = activeUsers.find(
            (user: any) => user.userId==receiverId
          );
          if(user){
            console.log('user consolinng in notification follow socket',user)
            socket.to(user.socketId).emit('followNotify',notification);
          }else{
            console.log('no user found bro... in notification')
          }
         
         
        } catch (err) {
          console.error('Error sending notification:', err);
        }
      });
    socket.on("disconnect", () => {
        console.log("socket disconnected in notifications");
      });
 }) 
}
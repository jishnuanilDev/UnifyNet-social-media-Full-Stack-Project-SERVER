import { User, PendingUser } from "../models/user";
import Post from "../models/post";
import { IUser } from "models/user";
import mongoose from "mongoose";
import Comment from "../models/comments";
import { Chat } from "../models/chatSchema";
import ChatMessage from "../models/message";

export class UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      console.log("reached login find email");
      return await User.findOne({ email });
    } catch (err) {
      console.error("Error finding user email in repository:", err);
      return null;
    }
  }

  async checkUserExist(
    // user sign up
    email: string
  ) {
    try {
      return await User.findOne({ email });
    } catch (err) {
      console.error("Error finding user exist:in repository", err);
    }
  }

  async createUser(enteredOtp: string) {
    try {
      const pendingUser = await PendingUser.findOne({ OTP: enteredOtp });
      const newUser = new User({
        fullname: pendingUser?.fullname,
        email: pendingUser?.email,
        password: pendingUser?.password,
      });
      return await newUser
        .save()
        .then((data) => {
          console.log("newUser data:", data);
        })
        .catch((err) => {
          console.log("Error occured in new user save in repository", err);
        });
    } catch (err) {
      console.error("Error occured during creating user in repository:", err);
    }
  }

  async createPendingUser(
    fullname: string,
    email: string,
    password: string,
    OTP: string,
    otpExpiresAt: Date
  ) {
    try {
      const pendingUser = new PendingUser({
        fullname,
        email,
        password,
        OTP,
        otpExpiresAt,
      });
      return await pendingUser.save();
    } catch (err) {
      console.error(
        "Error occured during creating pending user in repository:",
        err
      );
    }
  }

  async verifyOtp(enteredOtp: string) {
    try {
      return await PendingUser.findOne({ OTP: enteredOtp });
    } catch (err) {
      console.error("Error occured during OTP verifying:", err);
    }
  }

  async deletePendingUser(email: string) {
    try {
      await PendingUser.deleteMany({ email });
    } catch (err) {
      console.error(
        "Error occured during delete pending user in repository:",
        err
      );
    }
  }

  async findUserByUsername(username: string) {
    try {
      return await User.findOne({ username });
    } catch (err) {
      console.error("Error finding username exist in repository:", err);
      return null;
    }
  }

  async createUserProfile(
    email: string,
    username: string,
    phone: number,
    bio: string,
    gender: string
  ) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found for create profile in repository");
      }
      user.username = username;
      user.phone = phone;
      user.bio = bio;
      user.gender = gender;
      await user.save();
      console.log("User profile updated successfully");
      return user;
    } catch (err) {
      console.error(
        "Error occured during creating user profile in user repository:",
        err
      );
    }
  }

  async updateUserProfile(
    username: string,
    fullname: string,
    bio: string,
    email: string,
    profilePic?: string
  ) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found for fetch profile in repository");
      }
      user.username = username;
      user.fullname = fullname;
      user.bio = bio;
      user.profilePic = profilePic;
      return await user.save();
    } catch (err) {
      console.error(
        "Error occured during Updating user profile in user repository:",
        err
      );
    }
  }

  async updatePassword(newPass: string, email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found for updating password repository");
      }

      user.password = newPass;
      return await user.save();
    } catch (err) {
      console.error(
        "Error occured during in update password in user repository"
      );
    }
  }

  async resetPassword(email: string, newPassword: string) {
    try {
      console.log("userEmail for reseting password:", email);
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found for updating password repository");
      }
      user.password = newPassword;

      return await user.save();
    } catch (err) {
      console.error(
        "Error occured during in forgot passord check repository",
        err
      );
    }
  }
  async blockUser(userId: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found ");
      }

      if (user.isBlocked) {
        await User.findByIdAndUpdate(userId, { isBlocked: false });
      } else {
        await User.findByIdAndUpdate(userId, { isBlocked: true });
      }

      return await user.save();
    } catch (err) {
      console.error("Error occured during in blockUser in repository", err);
    }
  }

  async searchName(searchName: string) {
    try {
      const users = await User.find({
        username: { $regex: `^${searchName}`, $options: "i" },
      });
      return users;
    } catch (err) {}
  }

  async fetchFriendProfile(username: string) {
    try {
      const user = User.findOne({ username }).populate("posts");
      if (!user) {
        throw new Error("Friend not found ");
      }
      return user;
    } catch (err) {
      console.error(
        "Error occured during fetching friend profile repository",
        err
      );
    }
  }

  async followProfile(userId: string, username: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const friendUser = await User.findOne({ username });
      if (!friendUser) {
        throw new Error("Friend not found ");
      }
      friendUser.followers.unshift(user._id as mongoose.Schema.Types.ObjectId);
      await friendUser.save();

      user.following.unshift(friendUser._id as mongoose.Schema.Types.ObjectId);
      await user.save();

      return;
    } catch (err) {
      console.error(
        "Error occured during follow request in user repository",
        err
      );
    }
  }

  async unFollowProfile(userId: string, username: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const friendUser = await User.findOne({ username });
      if (!friendUser) {
        throw new Error("Friend not found ");
      }
      const idUser = user._id as mongoose.Schema.Types.ObjectId;
      const idFriendUser = friendUser._id as mongoose.Schema.Types.ObjectId;
      friendUser.followers = friendUser.followers.filter(
        (followerId) => followerId.toString() !== idUser.toString()
      );
      await friendUser.save();
      user.following = user.following.filter(
        (followingId) => followingId.toString() !== idFriendUser.toString()
      );
      await user.save();
      return;
    } catch (err) {
      console.error(
        "Error occured during follow request in user repository",
        err
      );
    }
  }

  async blueTickProceed(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      user.isPremium = true;
      return await user.save();
    } catch (err) {
      console.error("Error occured during blue tick confirm repository", err);
    }
  }

  async createNewChat(userId: string,participantId:string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const chatExist = await Chat.findOne({
        participants:{$all:[userId,participantId]}
      })
      if(chatExist){
        return null;
      }
const newChat = new Chat({
  participants: [userId, participantId],
  messages: [],
  lastMessage: null,
})
const savedChat = await newChat.save();
    
return savedChat;
    } catch (err) {
      console.error("Error occured during create new chat in  repository", err);
    }
  }

  async fetchUserConversations(userId:string){
    try{
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const chats = await Chat.find({
        participants:userId
      }).populate('participants','username');

      return chats;
    }catch(err){
      console.error("Error occured during fetch conversations repository", err);
    }
  }

  async sendMessage(userId:string,chatId:string,message:string){
    try{
      console.log('chatid display user repository send message',chatId);
const chat = await Chat.findById(chatId);
if (!chat) {
  throw new Error('Chat not found');
}
const sender = await User.findById(userId);
if (!sender) {
  throw new Error('Sender not found');
}

const newMessage = new ChatMessage({
  chat:chat._id,
  sender:sender._id,
  message:message,
  status:'delivered'
})

await newMessage.save();
await newMessage.populate('sender', 'username');
chat.messages.push(newMessage._id);
await chat.save();
return newMessage;
    }catch(err){
      console.log("Error occured in storing message in user repository",err)
    }
  }

  async getMessages(chatId:any){
    try{
const chat = await Chat.findById(chatId.chatId).populate({
  path:'messages',
  select:'message createdAt status',
  populate:{
    path:'sender',
    select:'username'
  }
});
if (!chat) {
  throw new Error('Chat not found');
}

return chat.messages; 


    }catch(err){
      console.log("Error occured in get all messages in user repository",err)
    }
  }
}

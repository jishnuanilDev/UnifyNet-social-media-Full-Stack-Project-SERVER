import { User, PendingUser } from "../models/user";
import Post from "../models/post";
import { IUser } from "models/user";
import mongoose from "mongoose";
import { Comment, ReplyComment } from "../models/comments";
import { Chat } from "../models/chatSchema";
import ChatMessage from "../models/message";
import CommunityMessage from "../models/communityMessage";
import Community from "../models/communitySchema";
import cards from "razorpay/dist/types/cards";
import premiumUser from "../models/premiumUser";
import Notification from "../models/notifications";
import Product from "../models/products";
import Wishlist from "../models/wishlist";

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
    gender: string,
    profilePic: string
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
      user.profilePic = profilePic;
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
      const user = await User.findOne({ username })
      .populate({
        path: "posts",          
        populate: {
          path: "user",        
          select: "username",   
        },
      });
    
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

  async blueTickProceed(
    userId: string,
    fullname: string,
    phone: number,
    email: string,
    dateOfBirth: string,
    address: string
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const newPremiumUser = new premiumUser({
        user: user._id,
        fullname: fullname,
        phone: phone,
        email: email,
        dateOfBirth: dateOfBirth,
        address: address,
      });

      await newPremiumUser.save();
      user.premium = newPremiumUser._id;
      user.isPremium = true;

      return await user.save();
    } catch (err) {
      console.error("Error occured during blue tick confirm repository", err);
    }
  }

  async createNewChat(userId: string, participantId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const chatExist = await Chat.findOne({
        participants: { $all: [userId, participantId] },
      });
      if (chatExist) {
        return null;
      }
      const newChat = new Chat({
        participants: [userId, participantId],
        messages: [],
        lastMessage: null,
      });
      const savedChat = await newChat.save();

      return savedChat;
    } catch (err) {
      console.error("Error occured during create new chat in  repository", err);
    }
  }

  async fetchUserConversations(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const chats = await Chat.find({
        participants: userId,
      })
        .populate("participants", "username profilePic")
        .sort({ updatedAt: -1 });

      return chats;
    } catch (err) {
      console.error("Error occured during fetch conversations repository", err);
    }
  }

  async sendMessage(userId: string, chatId: string, message: string) {
    try {
      console.log("chatid display user repository send message", chatId);
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error("Chat not found");
      }
      const sender = await User.findById(userId);
      if (!sender) {
        throw new Error("Sender not found");
      }

      const newMessage = new ChatMessage({
        chat: chat._id,
        sender: sender._id,
        message: message,
        status: "delivered",
      });

      await newMessage.save();
      await newMessage.populate("sender", "username");
      chat.messages.push(newMessage._id);
      await chat.save();
      return newMessage;
    } catch (err) {
      console.log("Error occured in storing message in user repository", err);
    }
  }

  async getMessages(chatId: any) {
    try {
      const chat = await Chat.findById(chatId.chatId).populate({
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
    } catch (err) {
      console.log("Error occured in get all messages in user repository", err);
    }
  }

  async createCommunity(
    userId: string,
    participantId: string,
    communityName: string
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      // const chatExist = await Chat.findOne({
      //   participants:{$all:[userId,participantId]}
      // })
      // if(chatExist){
      //   return null;
      // }

      const newCommunity = new Community({
        name: communityName,
        participants: [userId, participantId],
        admin: userId,
        messages: [],
        lastMessage: null,
      });
      const savedCommunity = await newCommunity.save();

      return savedCommunity;
    } catch (err) {
      console.error("Error occured during create new chat in  repository", err);
    }
  }

  async fetchCommunities(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const communities = await Community.find({
        participants: userId,
      }).populate("participants", "username");

      return communities;
    } catch (err) {
      console.error("Error occured during fetch conversations repository", err);
    }
  }

  async sendCommunityMessage(
    userId: string,
    communityId: string,
    message: string
  ) {
    try {
      console.log(
        "community display user repository send message",
        communityId
      );
      console.log(
        "community display user repository send message MSG",
        message
      );

      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error("Chat not found");
      }
      const sender = await User.findById(userId);
      if (!sender) {
        throw new Error("Sender not found");
      }

      const newCommunityMessage = new CommunityMessage({
        community: community?._id,
        sender: sender._id,
        message: message,
        status: "delivered",
      });

      await newCommunityMessage.save();
      await newCommunityMessage.populate("sender", "username");
      community.messages.push(newCommunityMessage._id);
      await community.save();
      return newCommunityMessage;
    } catch (err) {
      console.log("Error occured in storing message in user repository", err);
    }
  }

  async getCommunityMessages(communityId: any) {
    try {
      const community = await Community.findById(communityId).populate({
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
    } catch (err) {
      console.log(
        "Error occured in get all community messages in user repository",
        err
      );
    }
  }

  async cancelPremium(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("user not found");
      }
      user.isPremium = false;
      const updatePremiumUser = await premiumUser.findByIdAndDelete(
        user.premium
      );
      user.premium = null;
      return await user.save();
    } catch (err) {
      console.log("Error occured in cancel premium in user repository", err);
    }
  }

  async editCommunity(userId: string, communityId: string, participantId: any) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error("community not found ");
      }

      if (participantId) {
        if (!community.participants.includes(participantId)) {
          community.participants.push(participantId);
        } else {
          return null;
        }
      }
      return await community.save();
    } catch (err) {
      console.error("Error occured during create new chat in  repository", err);
    }
  }

  async removeUserFromCommunity(memberId: string, communityId: string) {
    try {
      const updatedCommunity = await Community.findByIdAndUpdate(
        communityId,
        {
          $pull: { participants: memberId },
        },
        { new: true }
      );
      if (!updatedCommunity) {
        throw new Error("Failed to update community");
      }
      return updatedCommunity;
    } catch (err) {
      console.error(
        "Error occured in remove user from community in repository",
        err
      );
    }
  }

  async exitCommunity(userId: string, communityId: string) {
    try {
      const updatedCommunity = await Community.findByIdAndUpdate(
        communityId,
        {
          $pull: { participants: userId },
        },
        { new: true }
      );
      if (!updatedCommunity) {
        throw new Error("Failed to update community");
      }
      return updatedCommunity;
    } catch (err) {
      console.error(
        "Error occured in remove user from community in repository",
        err
      );
    }
  }

  async editCommunityName(communityName: string, communityId: string) {
    try {
      const community = await Community.findByIdAndUpdate(
        communityId,
        { name: communityName },
        { new: true }
      );

      if (!community) {
        throw new Error("Community not found.");
      }

      return community;
    } catch (err) {
      console.error("Error occured in edit community name in repository", err);
    }
  }

  async unsendMessage(userId: string, messageId: string, chatId: string) {
    try {
      console.log("Chat id for delete message", chatId);
      console.log("messageIdfor delete message", messageId);
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { messages: messageId } },
        { new: true }
      );

      if (!chat) {
        throw new Error("Chat not found.");
      }

      const chatMsg = await ChatMessage.findByIdAndDelete(messageId);

      if (!chatMsg) {
        throw new Error("Message not found.");
      }
    } catch (err) {
      console.error("Error occured in unsend message user in repository", err);
    }
  }

  async unsendCommunityMessage(
    userId: string,
    messageId: string,
    communityId: string
  ) {
    try {
      console.log("Chat id for delete community message", communityId);
      console.log("messageIdfor delete message", messageId);
      const community = await Community.findByIdAndUpdate(
        communityId,
        { $pull: { messages: messageId } },
        { new: true }
      );

      if (!community) {
        throw new Error("community not found.");
      }

      const communityMsg = await CommunityMessage.findByIdAndDelete(messageId);

      if (!communityMsg) {
        throw new Error("communityMsg not found.");
      }
    } catch (err) {
      console.error("Error occured in unsend message user in repository", err);
    }
  }

  async fetchNotifications(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found ");
      }
      const notifications = await Notification.find({
        receiver: userId,
      })
        .populate("post")
        .populate("sender", "username")
        .sort({ createdAt: -1 });

      return notifications;
    } catch (err) {
      console.error(
        "Error occured during fetch notificatioins repository",
        err
      );
    }
  }

  async ReadNotification(userId: string, notificationId: string) {
    try {
      console.log(
        "notificationId for mark as read  notification",
        notificationId
      );

      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification) {
        throw new Error("notification not found for mark as read");
      }

      return true;
    } catch (err) {
      console.error("Error occured in  mark as read user in repository", err);
    }
  }

  async clearAllNotifications(userId: string) {
    try {
      console.log("clearing all  notifications", userId);
      const user = await User.findById(userId);
      const result = await Notification.deleteMany({
        receiver: userId,
      });

      if (result.deletedCount === 0) {
        throw new Error("No notifications found for clearing");
      }

      return true;
    } catch (err) {
      console.error("Error occured in  mark as read user in repository", err);
    }
  }

  async fetchProducts() {
    try {
      return await Product.find({ isListed: true }).populate({
        path: "sellerId",
        select: "username phone", // Select only the username and phone from the seller (User)
      });
    } catch (err) {
      console.error(
        "Error occured in product fetching in user repository",
        err
      );
    }
  }

  async fetchUserLists(userId: string) {
    try {
      const userLists = await Product.find({ sellerId: userId });
      if (!userLists) {
        return null;
      }
      return userLists;
    } catch (err) {
      console.error(
        "Error occured in product fetching in user repository",
        err
      );
    }
  }

  async markAsSold(listId: string) {
    try {
      // console.log("listID anoodoo", listId);

      const soldProduct = await Product.findOneAndUpdate(
        { _id: listId },
        { isSold: true },
        { new: true }
      );
      if (!soldProduct) {
        console.log("Error updating product mark as sold");
        return null;
      }
      return soldProduct;
    } catch (err) {
      console.error(
        "Error occured in product fetching in user repository",
        err
      );
    }
  }

  async fetchReplies(commentId: string) {
    try {
      // Find all replies that are linked to the given commentId
      const replies = await ReplyComment.find({ comment: commentId })
        .populate({
          path: "user",
          select: "username", // Populate the 'user' field and select specific fields, e.g., username
        })
        .sort({ createdAt: -1 });

      if (replies.length === 0) {
        console.log("No replies found for this comment");
        throw new Error("No replies found in commentId");
      }
      console.log("replies kitttind in fetching replies", replies);

      return replies;
    } catch (err) {
      console.error("Error occurred in fetching replies:", err);
      return null;
    }
  }

  async addToWishlist(productId: any, userId: string) {
    try {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = new Wishlist({
          user: userId,
          products: [productId],
        });
      } else {
        if (wishlist.products.includes(productId)) {
          return { message: "Already in the wishlist" };
        } else {
          wishlist.products.push(productId);
        }
      }
      const product = await Product.findById(productId);
      if (!product) {
        return { message: "Product not found" };
      }
      product.isWishlisted = true;

      await product?.save();
      await wishlist.save();
      return { message: "Product added to wishlist" };
    } catch (err) {
      console.error("Error occurred in fetching replies:", err);
      return null;
    }
  }

  async fetchUserWishlist(userId: string) {
    try {
      console.log('fetch user wishlists by userId',userId);
      const userWishlist = await Wishlist.findOne({ user: userId })
        .populate({
          path: "products",
          populate: {
            path: "sellerId",
            select: "username phone",
          },
        })
        .exec();

      if (!userWishlist) {
        return null;
      }

      return userWishlist;
    } catch (err) {
      console.error("Error occurred in fetching user wishlist:", err);
      throw new Error("Error occurred while fetching user wishlist");
    }
  }

  async removeFromWishlist(userId: any, productId: any) {
    try {
      const user = await User.findOne({ _id: userId });
      console.log("userId for remove product from wishlist", userId);
      const userWishlist = await Wishlist.findOne({ user: userId });

      if (!userWishlist) {
        throw new Error("Wishlist not found for the user.");
      }

      if (!userWishlist.products.includes(productId)) {
        throw new Error("Product not found in the wishlist.");
      }

      userWishlist.products = userWishlist.products.filter(
        (id) => id.toString() !== productId
      );
      const product = await Product.findById(productId);
      if (!product) {
        return { message: "Product not found" };
      }
      product.isWishlisted = false;
      await product?.save();
      await userWishlist.save();
      

      return { message: "Product removed from wishlist successfully." };
    } catch (err) {
      console.error(
        "Error occurred while removing product from wishlist:",
        err
      );
      throw new Error("Error occurred while removing product from wishlist");
    }
  }

  async fetchAllUsers(userId: string) {
    try {
      return await User.find({ _id: { $ne: userId } });
    } catch (err) {
      console.error(
        "error occured during in fetching users in admin panel",
        err
      );
    }
  }

  async deleteList(userId: any, productId: any) {
    try {
      const user = await User.findOne({ _id: userId });
      console.log("userId for delete product from userlist", userId);
      const userList = await Product.findByIdAndDelete({ sellerId: userId ,_id:productId});

      if (!userList) {
        throw new Error("userList not found for the user.");
      }

    
      return { message: "Product removed from wishlist successfully." };
    } catch (err) {
      console.error(
        "Error occurred while removing product from wishlist:",
        err
      );
      throw new Error("Error occurred while removing product from wishlist");
    }
  }
}

import { UserRepository } from "repositories/user-repository";
import { otpGenerator } from "../config/otp-generator";
import bcrypt from "bcrypt";
import { sendMail } from "../config/otp-mailer";
import { generateToken } from "../config/userAuth";
import cloudinary from "../config/cloudinary";

export class UserService {
  constructor(
    private UserRepository: UserRepository,
    private generatedOtp?: string
  ) {}

  async loginData(
    //login area
    email: string,
    password: string
  ) {
    console.log("reached login data userService");
    const user = await this.UserRepository.findUserByEmail(email);
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { status: 404, message: "Password not match" };
    }
    const token = await generateToken(user._id);

    if (!token) {
      console.log("no token get in user service");
    }

    return {
      status: 200,
      message: "Login successful",
      token: token,
      userIsBlocked: user.isBlocked,
    };
  }

  async tempSignUpdata(
    //signUp area
    fullname: string,
    email: string,
    password: string
  ): Promise<{ status: number; message: string }> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const checkUser = await this.UserRepository.checkUserExist(email);
    if (checkUser) {
      return { status: 409, message: "User already exist" };
    }
    const OTP: string = otpGenerator(4);
    const text = `Your OTP is:${OTP}. Please use this code to verify your identity.`;
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    sendMail(email, text);
    console.log("sendMail executed");

    await this.UserRepository.createPendingUser(
      fullname,
      email,
      hashedPassword,
      OTP,
      otpExpiresAt
    );

    return { status: 201, message: "Pending user created successfully" };
  }

  async verifyOtp(
    enteredOtp: string,
    email: string
  ): Promise<{ status: number; message: string }> {
    console.log("entered otp checking in user service verifyOTP", enteredOtp);
    const verifyOtp = await this.UserRepository.verifyOtp(enteredOtp);
    if (!verifyOtp) {
      console.log("not verified");
      return { status: 400, message: " OTP is invalid" };
    }

    if (new Date() > verifyOtp.otpExpiresAt) {
      await this.UserRepository.deletePendingUser(email);
      return { status: 400, message: "OTP expired" };
    }

    await this.UserRepository.createUser(enteredOtp);
    await this.UserRepository.deletePendingUser(email);
    return { status: 201, message: " User created successfully" };
  }

  async createProfile(
    email: string,
    username: string,
    phone: number,
    bio: string,
    gender: string,
    image?:any
  ): Promise<{ status: number; message: string; userToken?: string }> {
    try {
      const usernameExist = await this.UserRepository.findUserByUsername(
        username
      );
      if (usernameExist) {
        return { status: 409, message: "Username already taken" };
      }
      const result = await cloudinary.uploader.upload(image, {
        folder: "ProfilePic",
      });
      const updatedUser = await this.UserRepository.createUserProfile(
        email,
        username,
        phone,
        bio,
        gender,
        result.secure_url
      );
      const token = await generateToken(updatedUser?._id);
      if (!token) {
        console.log("no token get in user service on sign up");
      }
      return {
        status: 201,
        message: "User profile created successfully",
        userToken: token,
      };
    } catch (err) {
      console.error(
        "Error occured during creating user profile in user service:",
        err
      );
      return {
        status: 500,
        message: "Error occurred during creating user profile",
        userToken: "",
      };
    }
  }

  async updateProfile(
    username: string,
    fullname: string,
    bio: string,
    email: string,
    image?: any
  ) {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      const usernameExistUser = await this.UserRepository.findUserByUsername(
        username
      );
      if (usernameExistUser && user) {
        if (usernameExistUser.username != user.username && usernameExistUser) {
          return { status: 409, message: "Username already taken" };
        }
      }

      let imageUrl = user?.profilePic; 
      if (image) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "ProfilePic",
        });
        imageUrl = result.secure_url; // Update imageUrl if a new image is uploaded
      }

    
      const updatedUser = await this.UserRepository.updateUserProfile(
        username,
        fullname,
        bio,
        email,
        imageUrl 
      );
      if (updatedUser) {
        return {
          status: 201,
          message: "Upadated your profile",
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error fetching user profile in user service", err);
    }
  }

  async updatePassword(
    currentPass: string,
    newPass: string,
    confirmNewPass: string,
    email: string
  ) {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      if (!user) {
        return { status: 404, message: "User not found" };
      }
      const passwordMatch = await bcrypt.compare(currentPass, user.password);
      if (!passwordMatch) {
        return { status: 404, message: "Your old password is incorrect" };
      }
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(newPass, saltRounds);
      const updatePassword = await this.UserRepository.updatePassword(
        hashedPassword,
        email
      );
      if (updatePassword) {
        return { status: 200, message: "User password updated successfully" };
      }
    } catch (err) {
      console.error("Error occured in updating password in user service", err);
      return { status: 404, message: "User password updating failed" };
    }
  }

  async forgotPasswordOtp(email: string) {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      if (!user) {
        console.log("User not found for forgot password");
        return { status: 404, message: "User not exist" };
      }
      console.log("Hey forgotPasswordOtp got it");
      const OTP: string = otpGenerator(4);
      const text = `Your OTP is:${OTP}. Please use this code to verify your identity.`;
      // const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      sendMail(email, text);
      this.generatedOtp = OTP;
      console.log(" forgot-pass sendMail executed");
      return { status: 201, message: "OTP send successfully" };
    } catch (err) {
      console.log("Error occured during in forgot passoword in server", err);
    }
  }

  async forgotPassswordOtpVerify(enteredOtp: string) {
    try {
      console.log("generatedOtp:", this.generatedOtp);
      console.log("EnteredOtp:", enteredOtp);
      if (this.generatedOtp == enteredOtp) {
        return { status: 200, message: "OTP verified successfully" };
      }
      return { status: 401, message: "OTP is invalid" };
    } catch (err) {
      console.error("Error occured during in verify forgot passsword otp", err);
    }
  }

  async resetPassword(userEmail: string, newPassword: string) {
    try {
      console.log("Password reset user service working");
      const user = await this.UserRepository.findUserByEmail(userEmail);
      if (!user) {
        return { status: 401, message: "User not exist" };
      }
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
      const updatedPassword = await this.UserRepository.resetPassword(
        userEmail,
        hashedPassword
      );
      if (updatedPassword) {
        const token = await generateToken(user._id);
        if (!token) {
          console.log("no token get in user service");
        }
        return {
          status: 200,
          message: "Password reseted successfully",
          userToken: token,
        };
      }
    } catch (err) {
      console.error("Error occured in reseting password in user serrvice", err);
      return { status: 404, message: "Error occured in reseting password" };
    }
  }

  async searchName(searchName: string) {
    try {
      const users = await this.UserRepository.searchName(searchName);
      if (!users) {
        return { status: 200, message: "No users found", users: null };
      }
      return { status: 200, users: users, message: "" };
    } catch (err) {
      console.error("Error occured in search usernames in user service", err);
      return { status: 401, message: "searching users failed" };
    }
  }

  async fetchFriendProfile(username: string) {
    try {
      const user = await this.UserRepository.fetchFriendProfile(username);
      return { status: 200, user: user };
    } catch (err) {
      console.error(
        "Error occured in fetching friend profile in user service",
        err
      );
    }
  }

  async followProfile(userId: string, username: string) {
    try {
      const result = await this.UserRepository.followProfile(userId, username);
      return { status: 200, message: `You Following ${username}` };
    } catch (err) {
      console.error("Error occured in follow request in user service", err);
    }
  }

  async unFollowProfile(userId: string, username: string) {
    try {
      const result = await this.UserRepository.unFollowProfile(
        userId,
        username
      );

      return { status: 200, message: `You Unfollowed ${username}` };
    } catch (err) {
      console.error("Error occured in follow request in user service", err);
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
      const result = await this.UserRepository.blueTickProceed(
        userId,
        fullname,
        phone,
        email,
        dateOfBirth,
        address
      );
      if (result) {
        return { status: 200, message: "Premium Activated Successfully" };
      }
    } catch (err) {
      console.error("Error occured in blue tick confirm in user service", err);
    }
  }

  async createNewChat(userId: string, participantId: string) {
    try {
      const result = await this.UserRepository.createNewChat(
        userId,
        participantId
      );
      if (result) {
        return { status: 200, message: "Chat Created Successfully" };
      } else {
        return { status: 401, message: "Chat already exist" };
      }
    } catch (err) {
      console.error("Error occured in create new chat in user service", err);
    }
  }

  async fetchUserConversations(userId: string) {
    try {
      const chats = await this.UserRepository.fetchUserConversations(userId);
      if (chats) {
        return { status: 200, chats: chats };
      }
    } catch (err) {
      console.error("Error occured in get conversations in user service", err);
    }
  }

  async sendMessage(userId: string, chatId: string, message: string) {
    try {
      const savedMessage = await this.UserRepository.sendMessage(
        userId,
        chatId,
        message
      );
      if (savedMessage) {
        return { status: 200, savedMessage: savedMessage };
      } else {
        return { status: 401, message: "Message not send" };
      }
    } catch (err) {
      console.log("error occured in sending message in user service", err);
    }
  }

  async getMessages(chatId: string) {
    try {
      const chatMessages = await this.UserRepository.getMessages(chatId);
      if (chatMessages) {
        return { status: 200, chatMessages: chatMessages };
      }
    } catch (err) {
      console.log("error occured in get messages in user service", err);
    }
  }

  async createCommunity(
    userId: string,
    participantId: string,
    communityName: string
  ) {
    try {
      const result = await this.UserRepository.createCommunity(
        userId,
        participantId,
        communityName
      );
      if (result) {
        return { status: 200, message: "community Created Successfully" };
      }
    } catch (err) {
      console.error("Error occured in create new chat in user service", err);
    }
  }
  async fetchCommunities(userId: string) {
    try {
      const communities = await this.UserRepository.fetchCommunities(userId);
      if (communities) {
        return { status: 200, communities: communities };
      }
    } catch (err) {
      console.error("Error occured in get conversations in user service", err);
    }
  }

  async sendCommunityMessage(
    userId: string,
    communityId: string,
    message: string
  ) {
    try {
      const savedMessage = await this.UserRepository.sendCommunityMessage(
        userId,
        communityId,
        message
      );
      if (savedMessage) {
        return { status: 200, savedMessage: savedMessage };
      } else {
        return { status: 401, message: "Message not send" };
      }
    } catch (err) {
      console.log("error occured in sending message in user service", err);
    }
  }

  async getCommunityMessages(communityId: string) {
    try {
      const communityChatMessages =
        await this.UserRepository.getCommunityMessages(communityId);
      if (communityChatMessages) {
        return { status: 200, communityChatMessages: communityChatMessages };
      }
    } catch (err) {
      console.log("error occured in get messages in user service", err);
    }
  }

  async cancelPremium(userId: string) {
    try {
      const user = await this.UserRepository.cancelPremium(userId);
      if (user) {
        return { status: 200, user: user };
      }
    } catch (err) {
      console.log("error occured in cancel premium in user service", err);
    }
  }

  async editCommunity(
    userId: string,
    communityId: string,
    participantId: string
  ) {
    try {
      const result = await this.UserRepository.editCommunity(
        userId,
        communityId,
        participantId
      );
      if (result) {
        return { status: 200, message: "community edited Successfully" };
      } else {
        return { status: 401, message: "Member already exist " };
      }
    } catch (err) {
      console.error("Error occured in create new chat in user service", err);
    }
  }

  async removeUserFromCommunity(memberId: string, communityId: string) {
    try {
      const result = await this.UserRepository.removeUserFromCommunity(
        memberId,
        communityId
      );
      if (result) {
        return { status: 200, message: "you removed " };
      } else {
        return { status: 401, message: "Remove failed " };
      }
    } catch (err) {
      console.log(
        "error occured in remove user from community in user service",
        err
      );
    }
  }

  async exitCommunity(userId: string, communityId: string) {
    try {
      const result = await this.UserRepository.exitCommunity(
        userId,
        communityId
      );
      if (result) {
        return { status: 200, message: "you exited successfully " };
      } else {
        return { status: 401, message: "Exiting failed " };
      }
    } catch (err) {
      console.log(
        "error occured in remove user from community in user service",
        err
      );
    }
  }

  async editCommunityName(communityName: string, communityId: string) {
    try {
      const result = await this.UserRepository.editCommunityName(
        communityName,
        communityId
      );
      if (result) {
        return { status: 200, message: "Renamed succesfully " };
      } else {
        return { status: 401, message: "Renamed failed " };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async unsendMessage(userId: string, messageId: string, chatId: string) {
    try {
      const result = await this.UserRepository.unsendMessage(
        userId,
        messageId,
        chatId
      );
      return { status: 200, message: "Message Removed " };
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async unsendCommunityMessage(
    userId: string,
    messageId: string,
    communityId: string
  ) {
    try {
      const result = await this.UserRepository.unsendCommunityMessage(
        userId,
        messageId,
        communityId
      );
      return { status: 200, message: " Message Removed " };
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async fetchNotifications(userId: string) {
    try {
      const notifications = await this.UserRepository.fetchNotifications(
        userId
      );
      if (notifications) {
        return { status: 200, notifications: notifications };
      }
    } catch (err) {
      console.error("Error occured in get conversations in user service", err);
    }
  }

  async ReadNotification(userId: string, notificationId: string) {
    try {
      const result = await this.UserRepository.ReadNotification(
        userId,
        notificationId
      );
      if (result) {
        return { status: 200, message: "Marked as read " };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async clearAllNotifications(userId: string) {
    try {
      const result = await this.UserRepository.clearAllNotifications(userId);
      if (result) {
        return { status: 200, message: "Notifications cleared " };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
  
  async fetchProducts() {
    try {
      const products = await this.UserRepository.fetchProducts();
      if (products) {
        return { status: 200, products:products };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async fetchUserLists(userId:string) {
    try {
      const userLists = await this.UserRepository.fetchUserLists(userId);
      if (userLists) {
        return { status: 200, userLists:userLists };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
  
  async markAsSold(listId:string) {
    try {
      const result = await this.UserRepository.markAsSold(listId);
      if (result) {
        return { status: 200, message:'Marked as sold',success:true };
      }else{
        return { status: 401, message:'Failed to mark as sold ',success:false };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
  
  async fetchReplies(commentId:string) {
    try {
      const replies = await this.UserRepository.fetchReplies(commentId);
      if (replies) {
        return { status: 200, replies:replies};
      }else{
        return { status: 401, replies:null};
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async addToWishlist(productId:string,userId:string) {
    try {
      const result = await this.UserRepository.addToWishlist(productId,userId);
      if (result) {
        return { status: 200, message:result.message};
      }else{
        return { status: 401, message:'Adding to Wishlist failed'};
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
  
  async fetchUserWishlist(userId:string) {
    try {
      const userWishlist = await this.UserRepository.fetchUserWishlist(userId);
      if (userWishlist) {
        return { status: 200, userWishlist:userWishlist };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
  
  async removeFromWishlist(userId:string,productId:string) {
    try {
      const userWishlist = await this.UserRepository.removeFromWishlist(userId,productId);
      if (userWishlist) {
        return { status: 200, success:true };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }

  async fetchUsers(userId:string) {
    try {
      const users = await this.UserRepository.fetchAllUsers(userId);
      if (!users) {
        return { status: 404, message: "No Users available" };
      }

      return { status: 200, users: users };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async deleteList(userId:string,productId:string) {
    try {
      const list = await this.UserRepository.deleteList(userId,productId);
      if (list) {
        return { status: 200, success:true };
      }
    } catch (err) {
      console.log("error occured in edit community name in user service", err);
    }
  }
}

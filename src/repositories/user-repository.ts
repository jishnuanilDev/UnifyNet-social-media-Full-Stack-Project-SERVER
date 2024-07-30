import { User, PendingUser } from "../models/user";
import Post from "../models/post";
import { IUser } from "models/user";
import mongoose from "mongoose";

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

  async uploadPost(
    email: string,
    caption: string,
    imgPublicId: string,
    imgUrl: string
  ) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found ");
      }

      const post = new Post({
        image: {
          public_id: imgPublicId,
          url: imgUrl,
        },
        caption: caption,
        user: user._id,
      });

      const newPost = await post.save();
      user.posts.push(newPost._id as mongoose.Schema.Types.ObjectId);
      return await user.save();
    } catch (err) {
      console.error(
        "Error occured during in uploading user post in user repository",
        err
      );
    }
  }

  async fetchPosts() {
    try {
      return await Post.find({}).populate("user", "username").populate({
        path: 'comments.user',
        select: 'username', 
      }).sort({ createdAt: -1 }).exec();
    } catch (err) {
      console.error("Error occured during fetchPosts in repository", err);
    }
  }

  async findPostById(postId: string) {
    try {
      return await Post.findById(postId);
    } catch (err) {
      console.error("Error occured during find post by id in repository", err);
    }
  }

  async likePost(postId: string, email: string) {
    try {
      const post = await this.findPostById(postId);
      const user = await this.findUserByEmail(email);
      if (post && user) {
        post.likes.push(user._id as mongoose.Types.ObjectId);
        await post.save();
      }
    } catch (err) {
      console.error("Error occured during liking postin repository", err);
    }
  }

  async unLikePost(postId: string, email: string) {
    try {
      const post = await this.findPostById(postId);
      const user = await this.findUserByEmail(email);
      if (post && user) {
        post.likes = post.likes.filter(
          (like: mongoose.Types.ObjectId) =>
            !like.equals(user._id as mongoose.Types.ObjectId)
        );
        await post.save();
      }
    } catch (err) {
      console.error("Error occured during liking post in repository", err);
    }
  }


  async fetchUserPosts(email:string){
try{
const user = await this.findUserByEmail(email);
if(!user){
  throw new Error("User not found ");
}

const posts = await Post.find({user:user});
if(posts){
  return posts;
}else{
  return null;
}
}catch(err){
  console.error("Error occured during fetching user posts repository", err);
}
  }

  async postComment(email:string,comment:string,postId:string){
    try{
const user = await this.findUserByEmail(email);
if(!user){
  throw new Error("User not found ");
}

const post = await this.findPostById(postId);

if(!post){
  throw new Error("Post not found ");
}

const newComment = {
  user:user._id as mongoose.Types.ObjectId,
  comment:comment,
  createdAt: new Date(),
}

post.comments.unshift(newComment);
await post.save();
return post;
    }catch(err){
      console.error("Error occured during post comment repository", err);
    }
  }


  async reportPost(email:string,report:string,postId:string){
    try{
const user = await this.findUserByEmail(email);
if(!user){
  throw new Error("User not found ");
}

const post = await this.findPostById(postId);

if(!post){
  throw new Error("Post not found ");
}

const newReport = {
  user:user._id as mongoose.Types.ObjectId,
  report:report,
  createdAt: new Date(),
}

post.reports.unshift(newReport);
await post.save();
return post;
    }catch(err){
      console.error("Error occured during posting post report repository", err);
    }
  }
}

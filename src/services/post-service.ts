import { PostRespository } from "repositories/post-repository";
import { UserRepository } from "repositories/user-repository";
import { otpGenerator } from "../config/otp-generator";
import bcrypt from "bcrypt";
import { sendMail } from "../config/otp-mailer";
import { generateToken } from "../config/jwt";
import cloudinary from "../config/cloudinary";

export class PostService {
  constructor(
    private PostRespository: PostRespository,
    private UserRepository: UserRepository
  ) {}

  async createPost(email: string, caption: string, postImage: string) {
    try {
      const user = this.UserRepository.findUserByEmail(email);
      if (!user) {
        return { status: 401, message: "User not exist" };
      }

      const result = await cloudinary.uploader.upload(postImage, {
        folder: "Posts",
      });

      if (result) {
        const response = await this.PostRespository.uploadPost(
          email,
          caption,
          result.public_id,
          result.secure_url
        );
        if (response) {
          return { status: 200, message: "Post Published" };
        } else {
          return { status: 401, message: "Post Uploading failed" };
        }
      }
    } catch (err) {
      console.error("Error occured in user upload post in user service", err);
    }
  }

  async fetchPosts() {
    try {
      const posts = await this.PostRespository.fetchPosts();
      if (posts) {
        return { status: 200, posts: posts };
      } else {
        return { status: 401, message: "Post fetching failed" };
      }
    } catch (err) {
      console.error("Error occured in fetchPost in user service", err);
    }
  }

  async likePost(postId: string, email: string) {
    try {
      const result = await this.PostRespository.likePost(postId, email);
    } catch (err) {
      console.error("Error occured in like post in user service", err);
    }
  }

  async unLikePost(postId: string, email: string) {
    try {
      const result = await this.PostRespository.unLikePost(postId, email);
    } catch (err) {
      console.error("Error occured in like post in user service", err);
    }
  }

  async fetchUserPosts(email: string) {
    try {
      const posts = await this.PostRespository.fetchUserPosts(email);
      return { status: 200, posts: posts };
    } catch (err) {
      console.error("Error occured in fetch user posts in user service", err);
    }
  }

  async postComment(userId: string, comment: string, postId: string) {
    try {
      const result = await this.PostRespository.postComment(
        userId,
        comment,
        postId
      );
      if (result) {
        return { status: 200, message: "Comment added" };
      } else {
        return { status: 401, message: "Comment adding failed" };
      }
    } catch (err) {}
  }

  async reportPost(email: string, report: string, postId: string) {
    try {
      const result = await this.PostRespository.reportPost(
        email,
        report,
        postId
      );
      if (result) {
        return { status: 200, message: "Report Submitted" };
      } else {
        return { status: 401, message: "Report submitting failed" };
      }
    } catch (err) {}
  }
}

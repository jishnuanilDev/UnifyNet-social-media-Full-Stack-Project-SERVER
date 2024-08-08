import { User, PendingUser } from "../models/user";
import Post from "../models/post";
import { IUser } from "models/user";
import mongoose from "mongoose";
import Comment from "../models/comments";
import { UserRepository } from "repositories/user-repository";

export class PostRespository {

constructor(private UserRepository:UserRepository){}

    async uploadPost(
        email: string,
        caption: string,
        imgPublicId: string,
        imgUrl: string
      ) {
        try {
          const user = await this.UserRepository.findUserByEmail(email);
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
          return await Post.find({})
            .populate("user", "username")
            .populate({
              path: "comments",
              populate: { path: "user", select: "username" },
            })
            .sort({ createdAt: -1 })
            .exec();
        } catch (err) {
          console.error("Error occurred during fetchPosts in repository", err);
          throw new Error("Could not fetch posts");
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
          const user = await this.UserRepository.findUserByEmail(email);
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
          const user = await this.UserRepository.findUserByEmail(email);
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

      async fetchUserPosts(email: string) {
        try {
          const user = await this.UserRepository.findUserByEmail(email);
          if (!user) {
            throw new Error("User not found ");
          }
    
          const posts = await Post.find({ user: user });
          if (posts) {
            return posts;
          } else {
            return null;
          }
        } catch (err) {
          console.error("Error occured during fetching user posts repository", err);
        }
      }

      async postComment(userId: string, comment: string, postId: string) {
        try {
          const user = await User.findById(userId);
          if (!user) {
            throw new Error("User not found ");
          }
    
          const newComment = new Comment({
            post: postId,
            user: userId,
            comment: comment,
          });
    
          const savedComment = await newComment.save();
    
          const post = await Post.findByIdAndUpdate(
            postId,
            {
              $push: { comments: { $each: [savedComment._id], $position: 0 } },
            },
            { new: true }
          );
    
          if (!post) {
            throw new Error("Post not found");
          }
          return post;
        } catch (err) {
          console.error("Error occured during post comment repository", err);
        }
      }

      async reportPost(email: string, report: string, postId: string) {
        try {
          const user = await this.UserRepository.findUserByEmail(email);
          if (!user) {
            throw new Error("User not found ");
          }
    
          const post = await this.findPostById(postId);
    
          if (!post) {
            throw new Error("Post not found ");
          }
    
          const newReport = {
            user: user._id as mongoose.Types.ObjectId,
            report: report,
            createdAt: new Date(),
          };
    
          post.reports.unshift(newReport);
          await post.save();
          return post;
        } catch (err) {
          console.error("Error occured during posting post report repository", err);
        }
      }
}
import { User, PendingUser } from "../models/user";
import Post from "../models/post";
import { IUser } from "models/user";
import mongoose from "mongoose";
import { Comment, ReplyComment } from "../models/comments";
import { UserRepository } from "repositories/user-repository";

export class PostRespository {
  constructor(private UserRepository: UserRepository) {}

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
      return await Post.find({ isUnlisted: false })
        .populate("user", "username")
        .populate({
          path: "comments",
          populate: [
            { path: "user", select: "username" },
            { path: "replies", populate: { path: "user", select: "username" } },
          ],
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

  async fetchUserSavedPosts(email: string) {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found ");
      }
      await user.populate("savedPost");
      return user.savedPost || [];
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

  async deletePost(userId: string, postId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      if (post.user.toString() == userId) {
        await Post.findByIdAndDelete(postId);

        return { message: "Post deleted successfully" };
      }

      return { message: "You are not authorized for delete this post" };
      // Delete the post
    } catch (err) {
      console.error("Error occurred during deletePost in repository", err);
      throw err; // Propagate the error
    }
  }

  async savePost(userId: string, postId: string) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { savedPost: postId } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      // Return success message
      return { message: "Post saved successfully" };
    } catch (err) {
      console.error("Error occurred during savePost in repository", err);
      throw err; // Propagate the error
    }
  }

  async unsavePost(userId: string, postId: string) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedPost: postId } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return { message: "Post unsaved successfully" };
    } catch (err) {
      console.error("Error occurred during savePost in repository", err);
      throw err;
    }
  }

  async replyComment(userId: string, reply: string, commentId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found for reply comment");
      }

      const newReplyComment = new ReplyComment({
        comment: commentId,
        user: userId,
        commentReply: reply,
      });

      const savedReply = await newReplyComment.save();

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { replies: { $each: [savedReply._id], $position: 0 } },
        },
        { new: true }
      );

      if (!comment) {
        throw new Error("comment not found for add reply");
      }
      return comment;
    } catch (err) {
      console.error("Error occured during post comment repository", err);
    }
  }
}

import { User } from "../models/user";
import Post from "../models/post";

export class AdminRepository {
  async fetchAllUsers() {
    try {
      return await User.find({});
    } catch (err) {
      console.error(
        "error occured during in fetching users in admin panel",
        err
      );
    }
  }

  async fetchReportPosts() {
    try {
      return await Post.find({ "reports.0": { $exists: true } })
        .populate("user", "username")
        .populate({
          path: "reports.user",
          select: "username",
        })
        .exec();
    } catch (err) {
      console.error(
        "Error occurred during fetching reported posts in admin panel",
        err
      );
    }
  }

  async unlistPost(postId: string) {
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        throw new Error("Post not found");
      }
  
      post.isUnlisted = true;
      await post.save(); 
    } catch (err) {
      console.error("Error occurred during unlisting post", err);
    }
  }

  async listPost(postId: string) {
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        throw new Error("Post not found");
      }
  
      post.isUnlisted = false;
      await post.save(); 
    } catch (err) {
      console.error("Error occurred during unlisting post", err);
    }
  }
}

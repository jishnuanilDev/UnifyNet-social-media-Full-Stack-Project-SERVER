import { User } from "../models/user";
import Post from "../models/post";
import Admin from "../models/admin";
import premiumUser from "../models/premiumUser";
import bcrypt from "bcrypt";
import {Comment} from "../models/comments";
import Product from "../models/products";
export class AdminRepository {
  async adminFindByEmail(email: string) {
    return await Admin.find({ email });
  }

  async adminLogin(email: string, password: string) {
    try {
      console.log("adminlogin repo", email, password);
      const adminExist = await this.adminFindByEmail(email);
      if (adminExist) {
        return adminExist;
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newAdmin = await new Admin({
        email: email,
        password: hashedPassword,
      });

      await newAdmin.save();
      console.log("New admin created:", newAdmin);
      return newAdmin;
    } catch (err) {
      console.error(
        "error occured during in admin login in admin repository",
        err
      );
    }
  }
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

  async fetchAllComments() {
    try {
      return await Comment.find({});
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

  async fetchPremiumUsers() {
    try {
      return await premiumUser.find({}).populate("user", "username");
    } catch (err) {
      console.error(
        "error occured during in fetching users in admin panel",
        err
      );
    }
  }

  async blockUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("user not found for blocking");
      }
      if (user.isBlocked) {
        await User.findByIdAndUpdate(userId, { isBlocked: false });
        return { status: 200, message: "User unblocked successfully" };
      } else {
        await User.findByIdAndUpdate(userId, { isBlocked: true });
        return { status: 200, message: "User blocked successfully" };
      }
    } catch (err) {}
  }

  async premiumUserWeeklyTransaction() {
    try {
      const usersPerWeek = await premiumUser.aggregate([
        {
          $group: {
            _id: {
              week: { $week: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]);
      return usersPerWeek;
    } catch (err) {
      console.error("Error occurred in weekly transactions", err);
    }
  }

  async premiumUserMonthlyTransaction() {
    try {
      const usersPerWeek = await premiumUser.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]);
      return usersPerWeek;
    } catch (err) {
      console.error("Error occurred in monthly transactions", err);
    }
  }
  async premiumUserYearlyTransaction() {
    try {
      const usersPerWeek = await premiumUser.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]);
      return usersPerWeek;
    } catch (err) {
      console.error("Error occurred in yearly transactions", err);
    }
  }

  async fetchProducts() {
    try {
      return await Product.find();
    } catch (err) {
      console.error(
        "Error occured in product fetching in user repository",
        err
      );
    }
  }

  async unlistProduct(productId: string) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("product not found");
      }

      product.isListed = false;
      await product.save();
    } catch (err) {
      console.error("Error occurred during unlisting post", err);
    }
  }

  async listProduct(productId: string) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("product not found");
      }

      product.isListed = true;
      await product.save();
    } catch (err) {
      console.error("Error occurred during unlisting post", err);
    }
  }
}

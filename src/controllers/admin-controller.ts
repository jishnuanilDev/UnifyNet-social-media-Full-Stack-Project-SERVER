import { AdminService } from "services/admin-service";
import { Request, Response } from "express";

import jwt from "jsonwebtoken";
const SECRET_KEY = "jisd3v";
export class AdminController {
  constructor(private AdminService: AdminService) {}

  public fetchUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.AdminService.fetchUsers();

      res.status(users.status).json({ users: users.users });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public adminLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const credentials = {
        email: "jishnu@gmail.com",
        password: "jis321",
      };
      if (credentials.email != email) {
        return res.status(400).json({ info: "Admin not found" });
      }
      if (credentials.password != password) {
        return res.status(400).json({ info: "Invalid Password" });
      }

      const adminToken = jwt.sign({ email: credentials.email }, SECRET_KEY, {
        expiresIn: "5d",
      });

      return {
        status: 201,
        message: "User profile created successfully",
        adminToken: adminToken,
      };
    } catch (err) {
      console.error("Error occured in admin login on admin control", err);
    }
  };


  
  public fetchReportPosts = async (req: Request, res: Response) => {
    try {
      console.log('Reported posts server side access it')
      const posts = await this.AdminService.fetchReportPosts();
      

      res.status(posts.status).json({ posts: posts.posts });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public unlistPost = async (req: Request, res: Response) => {
    try {
      const {postId} = req.body;
      console.log('Unlist post with postIld',postId);
      console.log('Reported posts server side access it')
      const result = await this.AdminService.unlistPost(postId);
      

      res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public listPost = async (req: Request, res: Response) => {
    try {
      const {postId} = req.body;
      console.log('Unlist post with postIld',postId);
      console.log('Reported posts server side access it')
      const result = await this.AdminService.listPost(postId);
      

      res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };
}

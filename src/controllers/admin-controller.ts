import { AdminService } from "services/admin-service";
import { Request, response, Response } from "express";
import { IAdminAuthenticatedRequest } from "types/adminType";

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

  public fetchComments = async (req: Request, res: Response) => {
    try {
      const comments = await this.AdminService.fetchComments();

      res.status(comments.status).json({ comments: comments.comments });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };
  public adminLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
   const result  = await this.AdminService.adminLogin(email,password);
   if(result){
    res.status(result.status).json({ message: result.message,adminToken:result.adminToken });
   }
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

  public getPremiumUsers = async (req: Request, res: Response) => {
    try {
      const result = await this.AdminService.fetchPremiumUsers();

      res.status(result.status).json({ premiumUsers: result.premiumUsers });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public blockUser = async (req:IAdminAuthenticatedRequest,res:Response)=>{
    try{
const {userId} = req.body
const result  = await this.AdminService.blockUser(userId);
if(result){
  res.status(result.status).json({ message: result.message });
}
    }catch(err){
      console.error("Error occured in user block in admin control", err);
    }
  }

  public premiumUserWeeklyTransaction = async(req:Request,res:Response)=>{
    try{
      
const result = await this.AdminService.premiumUserWeeklyTransaction();
if(result){
  res.status(result.status).json({ data: result.data });
}
    }catch(err){
      console.error("Error occured in fetch premium user transactions weekly in admin control", err);
    }
  }
  
  public premiumUserMonthlyTransaction = async(req:Request,res:Response)=>{
    try{
     
const result = await this.AdminService.premiumUserMonthlyTransaction();
if(result){
  res.status(result.status).json({ data: result.data });
}
    }catch(err){
      console.error("Error occured in fetch premium user transactions monthly in admin control", err);
    }
  }

  public premiumUserYearlyTransaction = async(req:Request,res:Response)=>{
    try{
     
const result = await this.AdminService.premiumUserYearlyTransaction();
if(result){
  res.status(result.status).json({ data: result.data });
}
    }catch(err){
      console.error("Error occured in fetch premium user transactions monthly in admin control", err);
    }
  }

  public fetchProducts = async (req: Request, res: Response) => {
    try {
      const result = await this.AdminService.fetchProducts();
      if (result) {
        res.status(result.status).json({ products: result.products });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public unlistProduct = async (req: Request, res: Response) => {
    try {
      const {productId} = req.body;
      console.log('Unlist product with productId',productId);
      console.log('product unlist server side access it')
      const result = await this.AdminService.unlistProduct(productId);
      

      res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public listProduct = async (req: Request, res: Response) => {
    try {
      const {productId} = req.body;
      console.log('list product with productId',productId);
      console.log('product list server side access it')
      const result = await this.AdminService.listProduct(productId);
      

      res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };


}

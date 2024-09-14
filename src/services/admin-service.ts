import { AdminRepository } from "repositories/admin-repository";
import { GenerateTokenAdmin } from "../config/adminAuth";
import jwt from "jsonwebtoken";
const SECRET_KEY = "jisd3v";
export class AdminService {
  constructor(private AdminRepository: AdminRepository) {}

async adminLogin(email:string,password:string){
  try{
    const credentials = {
      email: "jishnu@gmail.com",
      password: "jis123",
    };
    if (credentials.email != email) {
      return { status: 400, message: "Admin not found ",adminToken:''};
    }
    if (credentials.password != password) {
      return { status: 400, message: "Inavlid password"};
    }
 const result  = await this.AdminRepository.adminLogin(email,password);
if(result){
  const adminToken = await GenerateTokenAdmin(credentials.email);
  
 if (!adminToken) {
  console.log("no admin token get in admin service");
}
return { status: 200, message: "Login successful", adminToken: adminToken };
}
return { status: 401, message: "Login failed", adminToken: '' };
  }catch(err){

  }
}

  
  async fetchUsers() {
    try {
      const users = await this.AdminRepository.fetchAllUsers();
      if (!users) {
        return { status: 404, message: "No Users  available" };
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
  async fetchComments() {
    try {
      const comments = await this.AdminRepository.fetchAllComments();
      if (!comments) {
        return { status: 404, message: "No comments  available" };
      }

      return { status: 200, comments: comments };
    } catch (err) {
      console.error("Error occured in fetching comments in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching comments in admin service",
      };
    }
  }

  async fetchReportPosts() {
    try {
      const posts = await this.AdminRepository.fetchReportPosts();
      if (!posts) {
        return { status: 404, message: "No posts availale" };
      }

      return { status: 200, posts: posts };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async unlistPost(postId:string) {
    try {
      const posts = await this.AdminRepository.unlistPost(postId);
      return { status: 200, message: 'Unlisted Successfully' };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async listPost(postId:string) {
    try {
      const posts = await this.AdminRepository.listPost(postId);
      return { status: 200, message: 'Unlisted Successfully' };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

    
  async fetchPremiumUsers() {
    try {
      const premiumUsers = await this.AdminRepository.fetchPremiumUsers();
      if (!premiumUsers) {
        return { status: 404, message: "No premium users not  available" };
      }

      return { status: 200, premiumUsers: premiumUsers };
    } catch (err) {
      console.error("Error occured in fetching premium users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching premium users in admin service",
      };
    }
}

async blockUser(userId:string){
  try{
const result = await this.AdminRepository.blockUser(userId);
if(result){
  return{status:result.status,message:result.message}
}else{
  return{status:401,message:'Blocking/Unblocking failed'}
}
  }catch(err){
    console.error("Error occured in blocking and unblocking user in admin service", err);
  }
}

async premiumUserWeeklyTransaction(){
  try{
const usersPerWeek = await this.AdminRepository.premiumUserWeeklyTransaction();
if(usersPerWeek){
  return{status:200,data:usersPerWeek}
}
  }catch(err){
    console.error("Error occured in premium users transactions weekly in admin service", err);
  }
}
async premiumUserMonthlyTransaction(){
  try{
const usersPerMonth = await this.AdminRepository.premiumUserMonthlyTransaction();
if(usersPerMonth){
  return{status:200,data:usersPerMonth}
}
  }catch(err){
    console.error("Error occured in premium users transactions monthly in admin service", err);
  }
}

async premiumUserYearlyTransaction(){
  try{
const usersPerYear = await this.AdminRepository.premiumUserYearlyTransaction();
if(usersPerYear){
  return{status:200,data:usersPerYear}
}
  }catch(err){
    console.error("Error occured in premium users transactions monthly in admin service", err);
  }
}

async fetchProducts() {
  try {
    const products = await this.AdminRepository.fetchProducts();
    if (products) {
      return { status: 200, products:products };
    }
  } catch (err) {
    console.log("error occured in edit community name in user service", err);
  }
}

async unlistProduct(productId:string) {
  try {
    const products = await this.AdminRepository.unlistProduct(productId);
    return { status: 200, message: 'Product unlisted Successfully' };
  } catch (err) {
    console.error("Error occured in fetching users in admin service", err);
    return {
      status: 500,
      message: "Product Unlisting failed",
    };
  }
}

async listProduct(productId:string) {
  try {
    const products = await this.AdminRepository.listProduct(productId);
    return { status: 200, message: 'Product listed Successfully' };
  } catch (err) {
    console.error("Error occured in fetching users in admin service", err);
    return {
      status: 500,
      message: "Product Listing failed",
    };
  }
}
}


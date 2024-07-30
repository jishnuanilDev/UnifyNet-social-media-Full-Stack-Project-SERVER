import { UserRepository } from "repositories/user-repository";
import { otpGenerator } from "../config/otp-generator";
import bcrypt from "bcrypt";
import { sendMail } from "../config/otp-mailer";
import { generateToken } from "../config/jwt";
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

    return { status: 200, message: "Login successful", token: token };
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
    gender: string
  ): Promise<{ status: number; message: string; userToken?: string }> {
    try {

      const usernameExist = await this.UserRepository.findUserByUsername(username);
      if(usernameExist){
        return { status: 409, message: "Username already taken" };
      }
      const updatedUser = await this.UserRepository.createUserProfile(
        email,
        username,
        phone,
        bio,
        gender
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
    profilePic?: string
  ) {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      const usernameExistUser = await this.UserRepository.findUserByUsername(username);
      if(usernameExistUser && user){
        if(usernameExistUser.username!=user.username && usernameExistUser){
          return { status: 409, message: "Username already taken" };
        }
        
      }
      const updatedUser = await this.UserRepository.updateUserProfile(
        username,
        fullname,
        bio,
        email,
        profilePic
      );
      if(updatedUser){
        return {
          status: 201,
          message: "Upadated your profile"
        };
      }else{
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

  async createPost(email: string, caption: string, postImage: string) {
    try {

   
      const user = this.UserRepository.findUserByEmail(email);
      if (!user) {
        return { status: 401, message: "User not exist" };
      }

      const result = await cloudinary.uploader.upload(postImage,{
        folder:"Posts",
      })

      if(result){

        const response = await this.UserRepository.uploadPost(
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


  async fetchPosts(){
    try{
const posts = await this.UserRepository.fetchPosts();
if(posts){
  return { status: 200,posts:posts };
}else{
  return { status: 401, message: "Post fetching failed" };
}
    }catch(err){
      console.error("Error occured in fetchPost in user service", err);
    }
  }


  async likePost(postId:string,email:string){
    try{
  
     const result = await this.UserRepository.likePost(postId,email);
    }catch(err){
      console.error("Error occured in like post in user service", err);
    }
  }

  async unLikePost(postId:string,email:string){
    try{
    
     const result = await this.UserRepository.unLikePost(postId,email);
    }catch(err){
      console.error("Error occured in like post in user service", err);
    }
  }

  async fetchUserPosts(email:string){
    try{
const posts = await this.UserRepository.fetchUserPosts(email)
return { status: 200,posts:posts };
    }catch(err){
      console.error("Error occured in fetch user posts in user service", err);
    }
  }

  async postComment(email:string,comment:string,postId:string){
try{
const result = await this.UserRepository.postComment(email,comment,postId);
if(result){
  return { status: 200,message:'Comment added' }
}else{
  return { status: 401,message:'Comment adding failed' }
}
}catch(err){

}
  }

  async reportPost(email:string,report:string,postId:string){
    try{
    const result = await this.UserRepository.reportPost(email,report,postId);
    if(result){
      return { status: 200,message:'Report Submitted' }
    }else{
      return { status: 401,message:'Report submitting failed' }
    }
    }catch(err){
    
    }
      }
}

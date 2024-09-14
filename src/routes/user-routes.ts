import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";
import { UserRepository } from "../repositories/user-repository";
import { protect } from "../middlewares/auth";
import upload from "../config/multer/profileMulterConfig";
import { productUpload } from "../config/multer/productConfig";
import express from "express";

const userRespository = new UserRepository();
const userService = new UserService(userRespository);
const userController = new UserController(userService);

const userRouter = express.Router();

userRouter.post("/login", userController.login);
userRouter.post("/sign-up", userController.signUp);
userRouter.post("/verify-otp", userController.verifyOtp);
userRouter.post("/create-profile", userController.createProfile);
userRouter.get("/profile", protect, userController.userProfile);
userRouter.put(
  "/edit-profile",
  protect,
  userController.updateProfile
);
userRouter.put("/change-password", protect, userController.updatePassword);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post(
  "/fpassword-otp/:email",
  userController.forgotPassswordOtpVerify
);
userRouter.put("/reset-password", userController.resetPassword);

userRouter.post("/search-name", userController.searchName);
userRouter.get("/friend-profile", userController.friendProfile);
userRouter.post("/follow", protect, userController.followProfile);
userRouter.post("/unFollow", protect, userController.unFollowProfile);
userRouter.post("/blueTickConfirmed", protect, userController.blueTickProceed);
userRouter.post("/create-new-chat", protect, userController.createNewChat);
userRouter.get("/conversations", protect, userController.getConversations);   
userRouter.post("/sendMessage", protect, userController.sendMessage);
userRouter.post("/getMessages",protect,userController.getMessages);
userRouter.patch("/cancel-premium",protect,userController.cancelPremium);
userRouter.post("/create-community", protect, userController.createCommunity);
userRouter.get("/communities", protect, userController.getCommunities);
userRouter.post("/communitySendMessage", protect, userController.communitySendMessage);  
userRouter.post("/getCommunityMessages",protect,userController.getCommunityMessages); 
userRouter.post("/add-user-to-community",protect,userController.editCommunity); 
userRouter.post("/remove-user-from-community",protect,userController.removeUserFromCommunity); 
userRouter.put("/edit-community-name",protect,userController.editCommunityName);  
userRouter.post("/unsend-message",protect,userController.unsendMessage); 
userRouter.post("/unsend-community-message",protect,userController.unsendCommunityMessage); 
userRouter.post("/exit-community",protect,userController.exitCommunity);   
userRouter.get("/get-notifications", protect, userController.getNotifications);  
userRouter.patch("/mark-as-read",protect,userController.ReadNotification);   
userRouter.put("/clearAllNotifications",protect,userController.clearAllNotifications);  
userRouter.post("/sell-new-product",protect,userController.sellNewProduct); 
userRouter.get("/fetch-products",userController.fetchProducts);
userRouter.get("/fetch-user-lists",protect,userController.fetchUserLists);
userRouter.post("/mark-as-sold",protect,userController.markAsSold); 
userRouter.get("/fetch-replies/:commentId",userController.fetchReplies);  
userRouter.post("/add-to-wishlist",protect,userController.addToWishlist);
userRouter.get("/fetch-user-wishlist",protect,userController.fetchUserWishlist);
userRouter.patch("/remove-from-wishlist",protect,userController.removeFromWishlist);
export default userRouter;

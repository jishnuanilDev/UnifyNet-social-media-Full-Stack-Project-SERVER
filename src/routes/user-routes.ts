import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";
import { UserRepository } from "../repositories/user-repository";
import { protect } from "../middlewares/auth";
import upload from "../config/multerConfig";

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
userRouter.post(
  "/edit-profile",
  protect,
  upload.single("profilePic"),
  userController.updateProfile
);
userRouter.post("/change-password", protect, userController.updatePassword);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post(
  "/fpassword-otp/:email",
  userController.forgotPassswordOtpVerify
);
userRouter.post("/reset-password", userController.resetPassword);

userRouter.post("/search-name", userController.searchName);
userRouter.get("/friend-profile", userController.friendProfile);
userRouter.post("/follow", protect, userController.followProfile);
userRouter.post("/unFollow", protect, userController.unFollowProfile);
userRouter.post("/blueTickConfirmed", protect, userController.blueTickProceed);
userRouter.post("/create-new-chat", protect, userController.createNewChat);
userRouter.get("/conversations", protect, userController.getConversations);
userRouter.post("/sendMessage", protect, userController.sendMessage);
userRouter.post("/getMessages",protect,userController.getMessages);
export default userRouter;

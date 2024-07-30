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
userRouter.post("/create-post", protect, userController.createPost);
userRouter.get("/get-posts", userController.fetchPosts);
userRouter.post("/like-post", protect, userController.likePost);
userRouter.post("/unLike-post", protect, userController.unLikePost);
userRouter.get("/user-posts", protect, userController.fetchUserPosts);
userRouter.post("/user-comment", protect, userController.postComment);
userRouter.post("/report-post", protect, userController.reportPost);

export default userRouter;

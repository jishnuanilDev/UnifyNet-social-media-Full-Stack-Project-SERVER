import { IAuthenticatedRequest } from "types/auth";
import { Request, Response } from "express";
import { UserService } from "services/user-service";
import razorpay from "../config/razorpay";
import { promises } from "dns";

export class UserController {
  constructor(private userService: UserService) {}
  public login = async (req: Request, res: Response): Promise<void> => {
    //login controller
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      console.log("Login credentials::", email, password);
      const result = await this.userService.loginData(email, password);
      console.log("token after generated", result.token);
      res
        .status(result.status)
        .json({ message: result.message, userToken: result.token });
    } catch (err) {
      console.error("Error occurred in login data", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  public signUp = async (req: Request, res: Response): Promise<void> => {
    //sign-up controller
    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);
    const result = await this.userService.tempSignUpdata(
      fullname,
      email,
      password
    );
    res.status(result.status).json({ message: result.message });
  };
  public verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { otp, email } = req.body;
    console.log("initial otp", otp);

    const enteredOtp = otp.join("");
    console.log("enteredOtp:", enteredOtp);

    const verify = await this.userService.verifyOtp(enteredOtp, email);
    res.status(verify.status).json({ message: verify.message });
  };

  public createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username, phone, bio, gender } = req.body;

      const result = await this.userService.createProfile(
        email,
        username,
        phone,
        bio,
        gender
      );
      console.log(
        " userToken verifying in after create profile",
        result.userToken
      );
      res
        .status(result.status)
        .json({ message: result.message, userToken: result.userToken });
    } catch (err) {
      console.error("Error occured in create profile in userController", err);
    }
  };

  public userProfile = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user;
      res.status(200).json({ user });
    } catch (err) {
      console.error(
        "Error occured in fetching user profile in user controller",
        err
      );
    }
  };

  public updateProfile = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { username, fullname, bio } = req.body;
      const user = req.user;
      const { email } = user as { email: string };
      const profilePic = req.file?.filename;
      const result = await this.userService.updateProfile(
        username,
        fullname,
        bio,
        email,
        profilePic
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in fetching user profile in user controller",
        err
      );
    }
  };

  public updatePassword = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { currentPass, newPass, confirmNewPass } = req.body;
      const user = req.user;
      console.log(user);
      const { email } = user as { email: string };
      console.log(email);
      const result = await this.userService.updatePassword(
        currentPass,
        newPass,
        confirmNewPass,
        email
      );
      if (result) {
        console.log("Password update result:", result.message);
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in updating password in user controller",
        err
      );
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;
      console.log("forgot-passed email", email);
      const result = await this.userService.forgotPasswordOtp(email);
      if (result) res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.log("Error occured in forgot password in user controller", err);
    }
  };

  public forgotPassswordOtpVerify = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { otp } = req.body;
      // const email = req.params.email;
      console.log("initial otp for forgot password", otp);

      const enteredOtp = otp.join("");
      console.log("enteredOtp:", enteredOtp);
      const result = await this.userService.forgotPassswordOtpVerify(
        enteredOtp
      );
      if (result) {
        res.status(result?.status).json({ message: result?.message });
      }
    } catch (err) {
      console.error("Error occured in during verify forgot password otp", err);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Password reset controller working");
      const { userEmail, newPassword } = req.body;
      const result = await this.userService.resetPassword(
        userEmail,
        newPassword
      );
      if (result)
        res
          .status(result?.status)
          .json({ message: result?.message, userToken: result.userToken });
    } catch (err) {
      console.error("Error occured in reset password in user controller", err);
    }
  };

  public searchName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchName } = req.body;
      const result = await this.userService.searchName(searchName);
      if (result) {
        res
          .status(result.status)
          .json({ message: result.message, users: result.users });
      }
    } catch (err) {
      console.error("Error occured in search user in user controller", err);
    }
  };

  public friendProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.query as { username: string };

      const result = await this.userService.fetchFriendProfile(username);
      if (result) {
        res.status(result.status).json({ user: result.user });
      }
    } catch (err) {
      console.error(
        "Error occured in fetching friend profile in user controller",
        err
      );
    }
  };

  public followProfile = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { username } = req.body;
      const { _id: userId } = req.user as { _id: string };

      const result = await this.userService.followProfile(userId, username);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in follow profile in user controller", err);
    }
  };
  public unFollowProfile = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { username } = req.body;
      const { _id: userId } = req.user as { _id: string };

      const result = await this.userService.unFollowProfile(userId, username);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in unfollow profile in user controller",
        err
      );
    }
  };

  public blueTickProceed = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { _id: userId } = req.user as { _id: string };
      console.log("user token checking here for blue tick purchase", userId);
      const result = await this.userService.blueTickProceed(userId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in blue tick confirm in user controller",
        err
      );
    }
  };

  public createNewChat = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { participantId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      console.log("participantId", participantId);
      console.log("userId", userId);

      const result = await this.userService.createNewChat(
        userId,
        participantId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in create new chat in user controller", err);
    }
  };

  public getConversations = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.fetchUserConversations(userId);
      if (result) {
        res.status(result.status).json({ chats: result.chats ,currentUserId:userId});
      }
    } catch (err) {
      console.error("Error occured get converstions in user controller", err);
    }
  };

  public sendMessage = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { chatId, message } = req.body;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.sendMessage(
        userId,
        chatId,
        message
      );
      if (result) {
        res.status(result.status).json({ savedMessage: result.savedMessage });
      }
    } catch (err) {
      console.log("Error occured in sending message in user controller", err);
    }
  };

  public getMessages = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const chatId = req.body;
      const {_id:userId} = req.user as {_id:string}
      const result = await this.userService.getMessages(chatId);
      if (result) {
        res.status(result.status).json({ chatMessages: result.chatMessages,currentUserId:userId });
      }
    } catch (err) {
      console.error("Error occured get messages in user controller", err);
    }
  };
}

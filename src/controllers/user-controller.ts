import { IAuthenticatedRequest } from "types/auth";
import { Request, Response } from "express";
import { UserService } from "services/user-service";

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
  public verifyOtp = async (req: Request, res: Response) => {
    const { otp, email } = req.body;
    console.log("initial otp", otp);

    const enteredOtp = otp.join("");
    console.log("enteredOtp:", enteredOtp);

    const verify = await this.userService.verifyOtp(enteredOtp, email);
    res.status(verify.status).json({ message: verify.message });
  };

  public createProfile = async (req: Request, res: Response) => {
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

  public userProfile = async (req: IAuthenticatedRequest, res: Response) => {
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

  public updateProfile = async (req: IAuthenticatedRequest, res: Response) => {
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

  public updatePassword = async (req: IAuthenticatedRequest, res: Response) => {
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

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("forgot-passed email", email);
      const result = await this.userService.forgotPasswordOtp(email);
      if (result) res.status(result.status).json({ message: result.message });
    } catch (err) {
      console.log("Error occured in");
    }
  };

  public forgotPassswordOtpVerify = async (req: Request, res: Response) => {
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

  public resetPassword = async (req: Request, res: Response) => {
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
      console.error("Error occured in reset password in user controller");
    }
  };

  public createPost = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { caption, postImage } = req.body;

      const user = req.user;
      const { email } = user as { email: string };
      const result = await this.userService.createPost(
        email,
        caption,
        postImage
      );
      if (result) {
        res.status(result?.status).json({ message: result?.message });
      }
    } catch (err) {
      console.error("Error occured in createPost user controller");
    }
  };

  public fetchPosts = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.fetchPosts();
      if (result) {
        res.status(result.status).json({ posts: result.posts });
      }
    } catch (err) {
      console.error("Error occured in fetchPost user controller");
    }
  };

  public likePost = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.body;
      const user = req.user;
      const { email } = user as { email: string };

      console.log("req.body post like", req.body);
      const result = await this.userService.likePost(postId, email);
    } catch (err) {
      console.error("Error occured in likepost user controller");
    }
  };

  public unLikePost = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { postId } = req.body;
      const user = req.user;
      const { email } = user as { email: string };

      console.log("req.body post like", req.body);
      const result = await this.userService.unLikePost(postId, email);
    } catch (err) {
      console.error("Error occured in unLikepost user controller");
    }
  };

  public fetchUserPosts = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { email } = user as { email: string };
      const result = await this.userService.fetchUserPosts(email);
      if (result) {
        res.status(result.status).json({ posts: result.posts });
      }
    } catch (err) {
      console.error("Error occured in fetchUserPosts user controller");
    }
  };

  public postComment = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { comment, postId } = req.body;

      const { email } = user as { email: string };
      const result = await this.userService.postComment(email, comment, postId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in post comment user controller");
    }
  };

  public reportPost = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { report, postId } = req.body;

      const { email } = user as { email: string };
      const result = await this.userService.reportPost(email, report, postId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in post comment user controller");
    }
  };
}

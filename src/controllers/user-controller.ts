import { IAuthenticatedRequest } from "types/auth";
import { Request, Response } from "express";
import { UserService } from "services/user-service";
import razorpay from "../config/razorpay";
import { promises } from "dns";
import cloudinary from "../config/cloudinary";
import Product from "../models/products";
import products from "razorpay/dist/types/products";

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
      res.status(result.status).json({
        message: result.message,
        userToken: result.token,
        userIsBlocked: result.userIsBlocked,
      });
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
      const { email, username, phone, bio, gender, image } = req.body;

      const result = await this.userService.createProfile(
        email,
        username,
        phone,
        bio,
        gender,
        image
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
      const { username, fullname, bio, image } = req.body;
      const user = req.user;
      const { email } = user as { email: string };

      const result = await this.userService.updateProfile(
        username,
        fullname,
        bio,
        email,
        image
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
      const { fullname, phone, email, dataOfBirth, address } = req.body;
      console.log("user token checking here for blue tick purchase", userId);
      const result = await this.userService.blueTickProceed(
        userId,
        fullname,
        phone,
        email,
        dataOfBirth,
        address
      );
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
        res
          .status(result.status)
          .json({ chats: result.chats, currentUserId: userId });
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
      const { _id: userId } = req.user as { _id: string };
      const result = await this.userService.getMessages(chatId);
      if (result) {
        res
          .status(result.status)
          .json({ chatMessages: result.chatMessages, currentUserId: userId });
      }
    } catch (err) {
      console.error("Error occured get messages in user controller", err);
    }
  };

  public createCommunity = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { participantId, communityName } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      console.log("participantId for community", participantId);
      console.log("userId for community", userId);

      const result = await this.userService.createCommunity(
        userId,
        participantId,
        communityName
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in create new chat in user controller", err);
    }
  };

  public getCommunities = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.fetchCommunities(userId);
      if (result) {
        res
          .status(result.status)
          .json({ communities: result.communities, currentUserId: userId });
      }
    } catch (err) {
      console.error("Error occured get converstions in user controller", err);
    }
  };
  public communitySendMessage = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = req.user;
      const { communityId, message } = req.body;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.sendCommunityMessage(
        userId,
        communityId,
        message
      );
      if (result) {
        res.status(result.status).json({ savedMessage: result.savedMessage });
      }
    } catch (err) {
      console.log("Error occured in sending message in user controller", err);
    }
  };

  public getCommunityMessages = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      console.log("hey bro this is check log for get community messages");
      const { communityId } = req.body;
      console.log("communityId for getting messages", communityId);
      const { _id: userId } = req.user as { _id: string };
      const result = await this.userService.getCommunityMessages(communityId);
      if (result) {
        res.status(result.status).json({
          communityChatMessages: result.communityChatMessages,
          currentUserId: userId,
        });
      }
    } catch (err) {
      console.error("Error occured get messages in user controller", err);
    }
  };

  public cancelPremium = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };

      const result = await this.userService.cancelPremium(userId);
      if (result) {
        res.status(result.status).json({ user: result.user });
      }
    } catch (err) {}
  };

  public editCommunity = async (
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { communityId, participantId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };

      const result = await this.userService.editCommunity(
        userId,
        communityId,
        participantId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in create new chat in user controller", err);
    }
  };

  public removeUserFromCommunity = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      console.log("user removing from community function");
      const user = req.user;
      const { memberId, communityId } = req.body;

      const result = await this.userService.removeUserFromCommunity(
        memberId,
        communityId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in remove user from community in user controller",
        err
      );
    }
  };

  public exitCommunity = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      console.log("user exiting from community ");
      const user = req.user;
      const { communityId } = req.body;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.exitCommunity(userId, communityId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in remove user from community in user controller",
        err
      );
    }
  };

  public editCommunityName = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { communityName, communityId } = req.body;
      const result = await this.userService.editCommunityName(
        communityName,
        communityId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error(
        "Error occured in edit community name in user controller",
        err
      );
    }
  };

  public unsendMessage = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      console.log("req.body for unsend message", req.body);
      const { messageId, chatId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.unsendMessage(
        userId,
        messageId,
        chatId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public unsendCommunityMessage = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      console.log("req.body for unsend community message", req.body);
      const { messageId, communityId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.unsendCommunityMessage(
        userId,
        messageId,
        communityId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public getNotifications = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      console.log("/get notifications for fetching notifications");
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.fetchNotifications(userId);
      if (result) {
        res.status(result.status).json({ notifications: result.notifications });
      }
    } catch (err) {
      console.error("Error occured get converstions in user controller", err);
    }
  };

  public ReadNotification = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      console.log("req.body for mark as read notification", req.body);
      const { notificationId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.ReadNotification(
        userId,
        notificationId
      );
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public clearAllNotifications = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.clearAllNotifications(userId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public sellNewProduct = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      console.log("sell new product reached server....");
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const {
        title,
        price,
        category,
        condition,
        location,
        description,
        images,
      } = req.body;
      console.log("req.body for  new product", title, price, category);
      const imageUploadPromises = images.map(
        (base64Image: string) =>
          new Promise((resolve, reject) => {
            // Determine the image type based on the prefix
            const matches = base64Image.match(
              /^data:(image\/[^;]+);base64,(.+)$/
            );
            if (!matches) {
              return reject(new Error("Invalid base64 image format"));
            }

            const [, mimeType, base64Data] = matches;

            // Upload to Cloudinary
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "products",
                  resource_type: "image",
                  format: mimeType.split("/")[1],
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              )
              .end(Buffer.from(base64Data, "base64"));
          })
      );

      const imageUploadResults = await Promise.all(imageUploadPromises);
      const imageUrls = imageUploadResults.map(
        (result: any) => result.secure_url
      );

      const newProduct = new Product({
        sellerId: userId,
        title,
        price,
        category,
        condition,
        location,
        description,
        images: imageUrls,
      });

      await newProduct.save();

      res.status(201).json({ message: "Product created successfully" });
    } catch (err) {
      console.error("Error creating product:", err);
      res
        .status(500)
        .json({ error: "An error occurred while creating the product" });
    }
  };

  public fetchProducts = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.fetchProducts();
      if (result) {
        res.status(result.status).json({ products: result.products });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public fetchUserLists = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.fetchUserLists(userId);
      if (result) {
        res.status(result.status).json({ userLists: result.userLists });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public markAsSold = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { listId } = req.body;
      const { _id: userId } = user as { _id: string };
      const result = await this.userService.markAsSold(listId);
      if (result) {
        res
          .status(result.status)
          .json({ message: result.message, success: result.success });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public fetchReplies = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { commentId } = req.params;
      console.log("commentID in params for replies f", commentId);
      const result = await this.userService.fetchReplies(commentId);
      if (result) {
        res.status(result.status).json({ replies: result.replies });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public addToWishlist = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { productId } = req.body;
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      console.log("productId for add to wishlist", productId);
      const result = await this.userService.addToWishlist(productId, userId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public fetchUserWishlist = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      console.log("fetching user wishlists.....");
      const result = await this.userService.fetchUserWishlist(userId);
      if (result) {
        res.status(result.status).json({ userWishlist: result.userWishlist });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public removeFromWishlist = async (
    req: IAuthenticatedRequest,
    res: Response
  ) => {
    try {
      const user = req.user;
      const { listId } = req.body;
      const { _id: userId } = user as { _id: string };
      console.log("remove product wishlists.....");
      const result = await this.userService.removeFromWishlist(userId, listId);
      if (result) {
        res.status(result.status).json({ success: result.success });
      }
    } catch (err) {
      console.error("Error occured in unsend Message in user controller", err);
    }
  };

  public fetchUsers = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const users = await this.userService.fetchUsers(userId);

      res.status(users.status).json({ users: users.users });
    } catch (err) {
      console.error("Error occured in fetchUsers in admin control", err);
    }
  };

  public editProduct = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      console.log("edit product reached server....");
      const user = req.user;
      const { _id: userId } = user as { _id: string };
      const {
        listId,
        title,
        price,
        category,
        condition,
        location,
        description,
        images,
      } = req.body;
      console.log("req.body for  edit product", title, price, category,images);

      if (images && images.length >= 1) {
        const imageUploadPromises = images.map(
          (base64Image: string) =>
            new Promise((resolve, reject) => {
              // Determine the image type based on the prefix
              const matches = base64Image.match(
                /^data:(image\/[^;]+);base64,(.+)$/
              );
              if (!matches) {
                return reject(new Error("Invalid base64 image format"));
              }

              const [, mimeType, base64Data] = matches;

              // Upload to Cloudinary
              cloudinary.uploader
                .upload_stream(
                  {
                    folder: "products",
                    resource_type: "image",
                    format: mimeType.split("/")[1],
                  },
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result);
                    }
                  }
                )
                .end(Buffer.from(base64Data, "base64"));
            })
        );
        const imageUploadResults = await Promise.all(imageUploadPromises);
        const imageUrls = imageUploadResults.map(
          (result: any) => result.secure_url
        );

        const product = await Product.findByIdAndUpdate(
          listId,
          {
            title,
            price,
            category,
            condition,
            location,
            description,
            image: imageUrls,
          },
          { new: true }
        );

        if (!product) {
          console.log("Product not found for editing");
          return res.status(404).json({ message: "Product not found" });
        }
        await product.save();
        res.status(201).json({ message: "Product Edited successfully" });
      } else {
        const product = await Product.findByIdAndUpdate(
          listId,
          {
            title,
            price,
            category,
            condition,
            location,
            description,
          },
          { new: true }
        );

        if (!product) {
          console.log("Product not found for editing");
          return res.status(404).json({ message: "Product not found" });
        }
        await product.save();
        res.status(201).json({ message: "Product Edited successfully" });
      }
    } catch (err) {
      console.error("Error creating product:", err);
      res
        .status(500)
        .json({ error: "An error occurred while creating the product" });
    }
  };
}

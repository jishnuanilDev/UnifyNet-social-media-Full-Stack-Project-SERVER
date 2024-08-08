import { PostService } from "services/post-service";
import { IAuthenticatedRequest } from "types/auth";
import { Request, Response } from "express";

export class PostController {
  constructor(private PostService: PostService) {}

  public createPost = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const { caption, postImage } = req.body;

      const user = req.user;
      const { email } = user as { email: string };
      const result = await this.PostService.createPost(
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
      const result = await this.PostService.fetchPosts();
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
      const result = await this.PostService.likePost(postId, email);
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
      const result = await this.PostService.unLikePost(postId, email);
    } catch (err) {
      console.error("Error occured in unLikepost user controller");
    }
  };

  public fetchUserPosts = async (req: IAuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { email } = user as { email: string };
      const result = await this.PostService.fetchUserPosts(email);
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

      const { _id: userId } = req.user as { _id: string };
      const result = await this.PostService.postComment(
        userId,
        comment,
        postId
      );
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
      const result = await this.PostService.reportPost(email, report, postId);
      if (result) {
        res.status(result.status).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occured in post comment user controller");
    }
  };
}

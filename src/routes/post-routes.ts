import express from "express";
import { PostController} from "../controllers/post-controller";
import { PostService } from "../services/post-service";
import { PostRespository} from "../repositories/post-repository";
import { protect } from "../middlewares/auth";


import { UserRepository } from "../repositories/user-repository";

const userRespository = new UserRepository();

const postRespository = new PostRespository(userRespository);
const postService = new PostService(postRespository,userRespository);
const postController = new PostController(postService);


const postRouter = express.Router();

postRouter.post("/create-post", protect, postController.createPost);
postRouter.get("/get-posts", postController.fetchPosts);
postRouter.post("/like-post", protect, postController.likePost);
postRouter.post("/unLike-post", protect, postController.unLikePost);
postRouter.get("/user-posts", protect, postController.fetchUserPosts);
postRouter.post("/user-comment", protect, postController.postComment);
postRouter.post("/report-post", protect, postController.reportPost);

export default postRouter;
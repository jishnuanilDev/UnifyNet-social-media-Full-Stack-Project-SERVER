import { AdminRepository } from "../repositories/admin-repository";
import { AdminService } from "../services/admin-service";
import { AdminController } from "../controllers/admin-controller";
import express from "express";

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const adminRouter = express.Router();

adminRouter.get("/getUsers", adminController.fetchUsers);
adminRouter.post("/admin-login", adminController.adminLogin);
adminRouter.get("/getReportPosts", adminController.fetchReportPosts);
adminRouter.post("/unlist-post", adminController.unlistPost);
adminRouter.post("/list-post", adminController.listPost);

export default adminRouter;

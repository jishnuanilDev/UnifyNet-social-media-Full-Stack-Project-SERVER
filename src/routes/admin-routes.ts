import { AdminRepository } from "../repositories/admin-repository";
import { AdminService } from "../services/admin-service";
import { AdminController } from "../controllers/admin-controller";
import express from "express";
import { protectAdmin } from "../middlewares/adminAuth";

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const adminRouter = express.Router();

adminRouter.get("/getUsers", adminController.fetchUsers); 
adminRouter.get("/get-comments", adminController.fetchComments);
adminRouter.post("/admin-login", adminController.adminLogin);
adminRouter.get("/getReportPosts", adminController.fetchReportPosts);
adminRouter.post("/unlist-post", adminController.unlistPost);
adminRouter.post("/list-post", adminController.listPost);
adminRouter.get("/premium-users", adminController.getPremiumUsers);
adminRouter.post("/block-user",adminController.blockUser); 
adminRouter.get("/premium-users/count/weekly", adminController.premiumUserWeeklyTransaction); 
adminRouter.get("/premium-users/count/monthly", adminController.premiumUserMonthlyTransaction); 
adminRouter.get("/premium-users/count/yearly", adminController.premiumUserYearlyTransaction);
adminRouter.get("/get-products", adminController.fetchProducts);
adminRouter.post("/unlist-product", adminController.unlistProduct);
adminRouter.post("/list-product", adminController.listProduct);


export default adminRouter;

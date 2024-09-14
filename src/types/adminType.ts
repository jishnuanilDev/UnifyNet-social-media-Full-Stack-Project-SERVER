import { Request } from "express";
import { IAdmin } from "../models/admin";

export interface IAdminAuthenticatedRequest extends Request {
  admin?: IAdmin;
}

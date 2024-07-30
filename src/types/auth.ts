import { Request } from "express";
import { IUser } from "../models/user";

export interface IAuthenticatedRequest extends Request {
  user?: IUser;
}

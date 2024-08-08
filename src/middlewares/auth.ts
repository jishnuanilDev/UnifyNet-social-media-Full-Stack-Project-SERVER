import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { User } from "../models/user";

interface AuthRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}
type DecodedToken = {
  userId: string;
};

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // console.log("initial state of token request");
    const token = req.headers.authorization;
    if (!token) {
      console.log(" 2 token missing");
      return res.status(401).json({ info: "Authorization token is missing" });
    }
    // console.log("token gotchaaa");

    const decoded = ( verifyToken(token)) as DecodedToken;
    const userId: string = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      // console.log("3 not find user ");
      return res.status(401).json({ error: "Invalid token" });
    }
    // console.log("4 token get , user passed to request");
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying user token in middleware:", err);
    return res.status(401).json({ info: "Invalid authorization token" });
  }
};

export { protect };

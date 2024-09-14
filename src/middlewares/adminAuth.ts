import { Request, Response, NextFunction } from "express";
import { verifyTokenAdmin } from "../config/adminAuth";
import Admin from "../models/admin";

interface AuthRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin?: any;
}
type DecodedToken = {
  adminEmail: string;
};

const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      console.log(" 2 token missing in admin");
      return res.status(401).json({ info: "Admin authorization token is missing" });
    }
  
console.log('admin token',token);
    const decoded = ( verifyTokenAdmin(token)) as DecodedToken;
    console.log('decoded admin middleware',decoded)
    const adminEmail: string = decoded.adminEmail;
  
    console.log('admin email decoded',adminEmail);
    const admin = await Admin.find({adminEmail});

    if (!admin) {
      console.log("3 not find admin ");
      return res.status(401).json({ error: "Invalid token admin" });
    }
   
    // console.log("4 token get , user passed to request");
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Error verifying admin token in middleware:", err);
    return res.status(401).json({ info: "Invalid authorization admin token" });
  }
};

export { protectAdmin };

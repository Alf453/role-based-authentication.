import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1] || null;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== role)
      return res.status(403).json({ message: "Forbidden" });
    next();
  };

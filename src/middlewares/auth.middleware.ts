import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { CustomApiRequest } from "../common/interfaces";
import { HttpException } from "../common/interfaces";
import { StatusCodes } from "http-status-codes";

export const authenticate = async (
  req: CustomApiRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) {
      // throw new HttpException(StatusCodes.UNAUTHORIZED, "User not found");
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    next(new HttpException(StatusCodes.UNAUTHORIZED, "Invalid token"));
  }
};

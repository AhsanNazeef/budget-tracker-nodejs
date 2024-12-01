import { StatusCodes } from "http-status-codes";
import { HttpException } from "../common/interfaces";
import User from "../models/user.model";
import { IUser, IUpdateProfileBody } from "../common/interfaces";

export const getProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

export const updateProfile = async (
  userId: string,
  updates: IUpdateProfileBody
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

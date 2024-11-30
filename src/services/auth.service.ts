import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../common/interfaces";
import { HttpException } from "../common/interfaces";
import { StatusCodes } from "http-status-codes";

const generateToken = (userId: string, secret: string, expiresIn: string) => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  return user.save();
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid password");
  }

  const token = generateToken(
    (user._id as string).toString(),
    process.env.JWT_SECRET as string,
    "1h"
  );
  const refreshToken = generateToken(
    (user._id as string).toString(),
    process.env.JWT_REFRESH_SECRET as string,
    "7d"
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { token, refreshToken };
};

export const refreshToken = async (token: string): Promise<string> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid refresh token"
      );
    }

    return generateToken(
      (user._id as string).toString(),
      process.env.JWT_SECRET as string,
      "1h"
    );
  } catch (error) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
};

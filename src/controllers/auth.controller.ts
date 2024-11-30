import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as authService from "../services/auth.service";
import {
  CustomApiRequest,
  HttpException,
  ICreateUserRequestBody,
  ILoginRequestBody,
  IRefreshTokenRequestBody,
} from "../common/interfaces";
import {
  createSuccessResponse,
  validateRequiredBodyParams,
} from "../common/helpers";
import { registerSchema } from "../common/validators/auth.validator";

export const register = async (
  req: CustomApiRequest<ICreateUserRequestBody>,
  res: Response
) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }
  validateRequiredBodyParams(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
  ]);
  const { firstName, lastName, email, password } = req.body;
  const user = await authService.registerUser(
    firstName,
    lastName,
    email,
    password
  );
  res.status(StatusCodes.CREATED).send(createSuccessResponse(user));
};

export const login = async (
  req: CustomApiRequest<ILoginRequestBody>,
  res: Response
) => {
  validateRequiredBodyParams(req.body, ["email", "password"]);
  const { email, password } = req.body;
  const { token, refreshToken } = await authService.loginUser(email, password);
  res
    .status(StatusCodes.OK)
    .send(createSuccessResponse({ token, refreshToken }));
};

export const refreshToken = async (
  req: CustomApiRequest<IRefreshTokenRequestBody>,
  res: Response
) => {
  validateRequiredBodyParams(req.body, ["token"]);
  const { token } = req.body;
  const newToken = await authService.refreshToken(token);
  res.status(StatusCodes.OK).send(createSuccessResponse({ token: newToken }));
};

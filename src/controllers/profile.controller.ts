import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as profileService from "../services/profile.service";
import { CustomApiRequest, IUpdateProfileBody } from "../common/interfaces";
import { createSuccessResponse } from "../common/helpers";
import { profileUpdateSchema } from "../common/validators/profile.validator";
import { HttpException } from "../common/interfaces";

export const getProfile = async (req: CustomApiRequest, res: Response) => {
  const profile = await profileService.getProfile(req.user!._id);
  res.status(StatusCodes.OK).send(createSuccessResponse(profile));
};

export const updateProfile = async (
  req: CustomApiRequest<IUpdateProfileBody>,
  res: Response
) => {
  const { error } = profileUpdateSchema.validate(req.body);
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }

  const profile = await profileService.updateProfile(req.user!._id, req.body);
  res.status(StatusCodes.OK).send(createSuccessResponse(profile));
};

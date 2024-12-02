import { Request, Response, NextFunction } from "express";
import { HttpException } from "../common/interfaces";
import { createErrorResponse } from "../common/helpers";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).send(createErrorResponse(err));
  }

  console.log(err);

  // Handle unknown errors
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      createErrorResponse(
        new HttpException(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      )
    );
};

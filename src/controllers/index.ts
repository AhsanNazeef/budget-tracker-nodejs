import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as homeServices from "../services";
import { CustomApiRequest } from "../common/interfaces";
import { createSuccessResponse } from "../common/helpers";

export const helloFromServer = async (
  req: CustomApiRequest<void>,
  res: Response
): Promise<void> => {
  const data = homeServices.helloFromServer();
  res.status(StatusCodes.OK).send(createSuccessResponse(data));
};

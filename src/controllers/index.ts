import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as homeServices from "../services";
import { CustomApiRequest } from "../common/interfaces";
import { createSuccessResponse } from "../common/helpers";

export const helloFromServer = async (req: CustomApiRequest, res: Response) => {
  const data = homeServices.helloFromServer();
  res.statusCode = StatusCodes.OK;
  res.send(createSuccessResponse(data));
};

import { Response } from "express";

import * as homeServices from "../services";
import { CustomApiRequest } from "common/interfaces";

export const helloFromServer = async (req: CustomApiRequest, res: Response) => {
  const data = homeServices.helloFromServer();
  res.json(data);
};

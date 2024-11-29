import { Router } from "express";

import * as homeController from "../controllers";

const router = Router();

router.get("/", homeController.helloFromServer);

export default router;

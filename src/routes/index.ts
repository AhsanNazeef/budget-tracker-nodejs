import * as homeController from "../controllers";
import authRouter from "./auth.routes";
import { createRouter } from "common/helpers";

const router = createRouter();

router.get("/", homeController.helloFromServer);
router.use("/auth", authRouter);

export default router;

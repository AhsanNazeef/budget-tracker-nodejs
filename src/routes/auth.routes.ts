import * as authController from "../controllers/auth.controller";
import { createRouter } from "../common/helpers";

const authRouter = createRouter();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;

import * as profileController from "../controllers/profile.controller";
import { createRouter } from "../common/helpers";
import { requireAuth } from "../middlewares/auth.middleware";

const profileRouter = createRouter();

profileRouter.use(requireAuth);
profileRouter.get("/", profileController.getProfile);
profileRouter.patch("/", profileController.updateProfile);

export default profileRouter;

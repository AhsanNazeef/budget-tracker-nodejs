import * as homeController from "../controllers";
import authRouter from "./auth.routes";
import expenseRouter from "./expense.routes";
import profileRouter from "./profle.routes";
import { createRouter } from "../common/helpers";

const router = createRouter();

router.get("/", homeController.helloFromServer);
router.use("/auth", authRouter);
router.use("/expenses", expenseRouter);
router.use("/profile", profileRouter);

export default router;

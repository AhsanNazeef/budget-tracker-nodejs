import * as homeController from "../controllers";
import authRouter from "./auth.routes";
import { createRouter } from "../common/helpers";
import expenseRouter from "./expense.routes";

const router = createRouter();

router.get("/", homeController.helloFromServer);
router.use("/auth", authRouter);
router.use("/expenses", expenseRouter);

export default router;

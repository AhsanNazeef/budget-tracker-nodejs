import * as expenseController from "../controllers/expense.controller";
import { createRouter } from "../common/helpers";
import { requireAuth } from "../middlewares/auth.middleware";

const expenseRouter = createRouter();

// All expense routes require authentication
expenseRouter.use(requireAuth);

expenseRouter.get("/:id", expenseController.getExpenseById);
expenseRouter.get("/", expenseController.getExpenses);
expenseRouter.post("/", expenseController.createExpense);
expenseRouter.patch("/:id", expenseController.patchExpense);
expenseRouter.put("/:id", expenseController.updateExpense);
expenseRouter.delete("/:id", expenseController.deleteExpense);

export default expenseRouter;

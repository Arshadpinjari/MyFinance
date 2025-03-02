import { Router } from "express";
import {
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getAllExpenses,
} from "../controllers/expenseController.js";
import validate from "../middlewares/validate.js";
import authenticateUser from "../middlewares/authenticateUser.js"; // ✅ Fix: Authentication added

import {
  validateTitleLength,
  validateDescriptionLength,
  validateExpenseCategory,
  validateAmount,
  validateDate,
} from "../utils/validations.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, getExpenses) // ✅ Fix: Authentication added
  .post(
    authenticateUser, // ✅ Fix: Authentication added
    validate({
      title: validateTitleLength,
      description: validateDescriptionLength,
      amount: validateAmount,
      category: validateExpenseCategory,
      date: validateDate,
    }),
    addExpense
  );

router.get("/all", authenticateUser, getAllExpenses); // ✅ Fix: Authentication added

router.route("/:id").put(authenticateUser, updateExpense).delete(authenticateUser, deleteExpense); // ✅ Fix: Authentication added

export default router;

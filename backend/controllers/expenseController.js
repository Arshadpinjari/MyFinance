import Expense from "../models/expenseModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

import {
  validateTitleLength,
  validateDescriptionLength,
  validateExpenseCategory,
  validateAmount,
  validateDate,
  validatePaginationParams,
} from "../utils/validations.js";

// ✅ Add Expense (with Authentication)
export const addExpense = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in to add expenses!" });
  }

  const { title, amount, category, description, date } = req.body;

  const newExpense = new Expense({
    user: req.user._id,
    title,
    amount,
    category,
    description,
    date,
  });

  await newExpense.save();

  return res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
});

// ✅ Update Expense
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    return res.status(404).json({ error: "Expense not found!" });
  }

  const { title, amount, category, description, date } = req.body;
  
  if (!title && !amount && !category && !description && !date) {
    return res.status(400).json({ error: "At least one field is required for update!" });
  }

  expense.title = title || expense.title;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;
  expense.description = description || expense.description;
  expense.date = date || expense.date;

  const updatedExpense = await expense.save();
  
  return res.status(200).json({
    message: "Expense updated successfully!",
    expense: updatedExpense,
  });
});

// ✅ Delete Expense
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    return res.status(404).json({ error: "Expense not found!" });
  }

  return res.status(200).json({ message: "Expense deleted successfully!" });
});

// ✅ Get Expenses with Pagination
export const getExpenses = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in to view expenses!" });
  }

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const paginationError = validatePaginationParams(page, pageSize);
  if (paginationError) {
    return res.status(400).json({ error: paginationError });
  }

  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const expenses = await Expense.find({ user: req.user._id }).skip(skip).limit(limit);

  const totalCount = await Expense.countDocuments({ user: req.user._id });
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const totalExpenses = await Expense.find({ user: req.user._id });
  const totalExpense = totalExpenses.reduce((acc, expense) => acc + expense.amount, 0) || 0; // ✅ Fix: Default to 0

  return res.status(200).json({
    message: "Expenses retrieved successfully!",
    expenses,
    totalExpense,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      pageSize,
    },
  });
});

// ✅ Get All Expenses without Pagination
export const getAllExpenses = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in to view expenses!" });
  }

  const expenses = await Expense.find({ user: req.user._id });

  const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0) || 0; // ✅ Fix: Default to 0

  return res.status(200).json({
    message: "All expenses retrieved successfully!",
    expenses,
    totalExpense,
  });
});

import { StatusCodes } from "http-status-codes";
import { HttpException, PaginationInfo } from "../common/interfaces";
import Expense from "../models/expense.model";
import { IExpense, IExpenseQueryParams } from "../common/interfaces";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createExpense = async (
  userId: string,
  title: string,
  price: number,
  date: Date
): Promise<IExpense> => {
  const expense = new Expense({
    title,
    price,
    date,
    user: userId,
  });
  return expense.save();
};

export const getExpenseById = async (
  userId: string,
  expenseId: string
): Promise<IExpense> => {
  if (!isValidObjectId(expenseId)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid expense ID");
  }

  const expense = await Expense.findOne({
    _id: expenseId,
    user: userId,
  });

  if (!expense) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Expense not found");
  }

  return expense;
};

export const getExpenses = async (
  userId: string,
  query: IExpenseQueryParams
): Promise<{ expenses: IExpense[]; pagination: PaginationInfo }> => {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sortBy = "date",
    sortOrder = "desc",
  } = query;

  const filter: any = { user: userId };

  if (search) {
    filter.$text = { $search: search };
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const sort: any = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Expense.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const pagination: PaginationInfo = {
    total,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { expenses, pagination };
};

export const updateExpense = async (
  userId: string,
  expenseId: string,
  updates: Partial<IExpense>
): Promise<IExpense> => {
  if (!isValidObjectId(expenseId)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid expense ID");
  }

  const expense = await Expense.findOne({
    _id: expenseId,
    user: userId,
  });

  if (!expense) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Expense not found");
  }

  Object.assign(expense, updates);
  return expense.save();
};

export const deleteExpense = async (
  userId: string,
  expenseId: string
): Promise<void> => {
  if (!isValidObjectId(expenseId)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid expense ID");
  }

  const result = await Expense.deleteOne({
    _id: expenseId,
    user: userId,
  });

  if (result.deletedCount === 0) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Expense not found");
  }
};

export const patchExpense = async (
  userId: string,
  expenseId: string,
  updates: Partial<IExpense>
): Promise<IExpense> => {
  if (!isValidObjectId(expenseId)) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid expense ID");
  }

  const expense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      user: userId,
    },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new HttpException(StatusCodes.NOT_FOUND, "Expense not found");
  }

  return expense;
};

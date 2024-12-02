import { StatusCodes } from "http-status-codes";
import {
  HttpException,
  IBudgetStatus,
  PaginationInfo,
} from "../common/interfaces";
import Expense from "../models/expense.model";
import User from "../models/user.model";
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
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const user = await User.findById(userId);
  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
  }

  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$price" },
      },
    },
  ]);

  const currentMonthTotal = monthlyExpenses[0]?.total || 0;

  if (currentMonthTotal + price > user.budgetLimit) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      `This expense would exceed your monthly budget limit of ${user.budgetLimit}`
    );
  }

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

export const getBudgetStatus = async (
  userId: string
): Promise<IBudgetStatus> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
  }

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const endOfMonth = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  );

  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $toDouble: "$price",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        total: { $round: ["$total", 2] },
        count: 1,
      },
    },
  ]);

  const currentMonthSpent = monthlyExpenses[0]?.total || 0;
  const remaining = Number((user.budgetLimit - currentMonthSpent).toFixed(2));

  return {
    budgetLimit: user.budgetLimit,
    currentMonthSpent,
    remaining,
    isOverBudget: currentMonthSpent > user.budgetLimit,
    totalExpenses: monthlyExpenses[0]?.count || 0,
  };
};

import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as expenseService from "../services/expense.service";
import {
  CustomApiRequest,
  HttpException,
  ICreateExpenseRequestBody,
  IExpenseQueryParams,
  IExpense,
} from "../common/interfaces";
import {
  createSuccessResponse,
  validateRequiredBodyParams,
} from "../common/helpers";
import {
  expenseSchema,
  expenseQuerySchema,
} from "../common/validators/expense.validator";

export const createExpense = async (
  req: CustomApiRequest<ICreateExpenseRequestBody>,
  res: Response
) => {
  const { error } = expenseSchema.validate(req.body);
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }

  validateRequiredBodyParams(req.body, ["title", "price", "date"]);
  const { title, price, date } = req.body;
  const expense = await expenseService.createExpense(
    req.user!._id,
    title,
    price,
    new Date(date)
  );
  res.status(StatusCodes.CREATED).send(createSuccessResponse(expense));
};

export const getExpenseById = async (req: CustomApiRequest, res: Response) => {
  const expense = await expenseService.getExpenseById(
    req.user!._id,
    req.params.id
  );
  res.status(StatusCodes.OK).send(createSuccessResponse(expense));
};

export const getExpenses = async (
  req: CustomApiRequest<{}, IExpenseQueryParams>,
  res: Response
) => {
  const { error } = expenseQuerySchema.validate(req.query);
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }

  const { expenses, pagination } = await expenseService.getExpenses(
    req.user!._id,
    req.query
  );
  res
    .status(StatusCodes.OK)
    .send(createSuccessResponse({ expenses, pagination }));
};

export const updateExpense = async (
  req: CustomApiRequest<Partial<ICreateExpenseRequestBody>>,
  res: Response
) => {
  const { error } = expenseSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }

  const updates: Partial<IExpense> = {
    ...(req.body.title && { title: req.body.title }),
    ...(req.body.price && { price: req.body.price }),
    ...(req.body.date && { date: new Date(req.body.date) }),
  };

  const expense = await expenseService.updateExpense(
    req.user!._id,
    req.params.id,
    updates
  );
  res.status(StatusCodes.OK).send(createSuccessResponse(expense));
};

export const deleteExpense = async (req: CustomApiRequest, res: Response) => {
  await expenseService.deleteExpense(req.user!._id, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
};

export const patchExpense = async (
  req: CustomApiRequest<Partial<ICreateExpenseRequestBody>>,
  res: Response
) => {
  const { error } = expenseSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    throw new HttpException(StatusCodes.BAD_REQUEST, error.details[0].message);
  }

  const updates: Partial<IExpense> = {
    ...(req.body.title && { title: req.body.title }),
    ...(req.body.price && { price: req.body.price }),
    ...(req.body.date && { date: new Date(req.body.date) }),
  };

  const expense = await expenseService.patchExpense(
    req.user!._id,
    req.params.id,
    updates
  );
  res.status(StatusCodes.OK).send(createSuccessResponse(expense));
};

import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { Document } from "mongoose";

/**
 * Custom request interface that includes the request body and query parameters,
 * along with optional session and authentication status.
 */
export interface CustomApiRequest<TBody = {}, TQuery = { [key: string]: any }>
  extends Request<ParamsDictionary, any, TBody, TQuery> {
  body: TBody;
  query: TQuery;
  user?: IUser;
}

/**
 * Response structure used for API responses.
 */
export interface ApiResponse {
  status: ResponseStatus;
  data?: unknown;
  message?: string;
  errors?: unknown;
}

/**
 * Enum for defining the possible status values for API responses.
 */
export enum ResponseStatus {
  SUCCESS = "success",
  FAIL = "fail",
  ERROR = "error",
}

/**
 * Class representing an HTTP exception with a status code, message, and optional validation errors.
 */
export class HttpException extends Error {
  statusCode: StatusCodes;
  validationErrors?: ValidationErrorDetails;

  constructor(statusCode: number, message: string, validationErrors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

/**
 * Structure for validation errors, where each key represents a field and each value is an array of error messages.
 */
export interface ValidationErrorDetails {
  [key: string]: string[];
}

export type TRole = "user" | "admin";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginRequestBody {
  email: string;
  password: string;
}

export interface IRefreshTokenRequestBody {
  token: string;
}
export interface IExpense extends Document {
  title: string;
  price: number;
  date: Date;
  user: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateExpenseRequestBody {
  title: string;
  price: number;
  date: string;
}

export interface IExpenseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "price" | "date";
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

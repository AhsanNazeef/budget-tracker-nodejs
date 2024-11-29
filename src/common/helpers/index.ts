import { StatusCodes } from "http-status-codes";
import { ApiResponse, ResponseStatus, HttpException } from "../interfaces";

/**
 * Builds a response indicating a successful operation.
 * @param responseData - The data to be included in the response.
 */
export const createSuccessResponse = (
  responseData: unknown = null
): ApiResponse => ({
  status: ResponseStatus.SUCCESS,
  data: responseData,
});

/**
 * Builds a response indicating a failed operation due to invalid data or unmet pre-conditions.
 * @param responseData - The data to be included in the response.
 */
export const createFailureResponse = (responseData: unknown): ApiResponse => ({
  status: ResponseStatus.FAIL,
  data: responseData,
});

/**
 * Builds a response indicating an error occurred during request processing.
 * @param error - The error that was thrown.
 */
export const createErrorResponse = (error: Error): ApiResponse => {
  const errorResponse: ApiResponse = {
    status: ResponseStatus.ERROR,
    message:
      error instanceof HttpException
        ? error.message
        : "There was a problem, please try again later.",
    ...(error instanceof HttpException && error.validationErrors
      ? { errors: error.validationErrors }
      : {}),
  };
  return errorResponse;
};

/**
 * Validates that all mandatory query parameters are present in the request query object.
 * Throws a `BadRequestException` if any required query parameter is missing.
 *
 * @param queryParams The query parameters object received from the request.
 * @param requiredQueryParams An array of query parameter keys that are mandatory.
 */
export const validateRequiredQueryParams = <T extends object>(
  queryParams: T,
  requiredQueryParams: (keyof T)[] = []
): void | never => {
  requiredQueryParams.forEach((param) => {
    if (!(param in queryParams)) {
      throw new BadRequestException(
        `The query parameter "${String(param)}" is mandatory.`
      );
    }
  });
};

/**
 * Validates that all mandatory body parameters are present in the request body object.
 * Throws a `BadRequestException` if any required body parameter is missing.
 *
 * @param requestBody The body object received from the request.
 * @param requiredBodyParams An array of body parameter keys that are mandatory.
 */
export const validateRequiredBodyParams = <T extends object>(
  requestBody: T,
  requiredBodyParams: (keyof T)[] = []
): void | never => {
  requiredBodyParams.forEach((param) => {
    if (!(param in requestBody)) {
      throw new BadRequestException(
        `The body parameter "${String(param)}" is required.`
      );
    }
  });
};

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", errors?: any) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}

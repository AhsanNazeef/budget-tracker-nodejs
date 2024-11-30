import { StatusCodes } from "http-status-codes";
import { ApiResponse, ResponseStatus, HttpException } from "../interfaces";
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from "express";

/**
 * A wrapper for async route handlers that catches any errors thrown during request processing.
 * @param fn - The route handler function.
 * @returns A function that can be used as a route handler.
 *
 */
export const asyncErrorHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

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

/*
 * Creates a new instance of an Express Router with support for async route handlers.
 */
export const createRouter = () => {
  const router = Router();

  type RouterMethod = "get" | "post" | "put" | "delete" | "patch";

  const originalMethods = {
    get: router.get.bind(router),
    post: router.post.bind(router),
    put: router.put.bind(router),
    delete: router.delete.bind(router),
    patch: router.patch.bind(router),
  } as const;

  const wrapMethod = (method: RouterMethod) => {
    return function (
      path: string | RegExp,
      ...handlers: RequestHandler[]
    ): ReturnType<(typeof router)[RouterMethod]> {
      const wrappedHandlers: RequestHandler[] = handlers.map((handler) => {
        if (typeof handler === "function") {
          return asyncErrorHandler(handler);
        }
        return handler;
      });

      // Use apply instead of call with spread
      return (originalMethods[method] as (...args: any[]) => any).apply(
        router,
        [path, ...wrappedHandlers]
      );
    };
  };

  (Object.keys(originalMethods) as RouterMethod[]).forEach((method) => {
    (router as any)[method] = wrapMethod(method);
  });

  return router;
};

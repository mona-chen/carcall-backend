import { Request, Response, NextFunction } from "express";
import AppError from "./../utils/appError";
import { DBError } from "objection";
import { dbLogger } from "../db/config.db";
import { fail } from "./request";
import { ErrorStack } from "../models/error.model";
import { logger } from "../utils/logger";
// import ErrorStack from "./../models/errorModel";

/**
 * Saves error details to the database.
 * @param err The error object to save.
 * @returns The ID of the saved error.
 */
// TODO: implement functionality
const saveError = async (err: any): Promise<number> => {
  const newError = await ErrorStack.query().insert({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  return newError.id;
};

/**
 * Handles MongoDB cast errors.
 * @param err The cast error object.
 * @returns AppError instance with appropriate message and status code.
 */
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate key errors in MongoDB.
 * @param err The duplicate key error object.
 * @returns AppError instance with appropriate message and status code.
 */
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB validation errors.
 * @param err The validation error object.
 * @returns AppError instance with appropriate message and status code.
 */
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT errors.
 * @returns AppError instance with appropriate message and status code.
 */
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", 401);

/**
 * Handles expired JWT errors.
 * @returns AppError instance with appropriate message and status code.
 */
const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

/**
 * Sends detailed error information in development environment.
 * @param err The error object.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const sendErrorDev = async (
  err: any,
  req: Request,
  res: Response
): Promise<any> => {
  if (req.originalUrl.startsWith("/api/v1")) {
    logger.error("ERROR 💥", err);
    return fail(res, "Something Went Wrong", err.statusCode, {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  logger.critical("CRITICAL 💥", err);
  const errorId = await saveError(err);
  return fail(res, "Something went wrong!", err.statusCode, {
    msg: err.message,
    errorId: errorId,
  });
};

/**
 * Sends summarized error information in production environment.
 * @param err The error object.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const sendErrorProd = async (
  err: any,
  req: Request,
  res: Response
): Promise<any> => {
  if (req.originalUrl.startsWith("/api/v1")) {
    if (err.isOperational) {
      const errorId = await saveError(err);
      return res.status(err.statusCode).json({
        status: err.status,
        message: `${err.message} (${errorId})`,
      });
    }

    logger.critical("CRITICAL 💥", err);
    const errorId = await saveError(err);
    return fail(res, "Something went wrong!", err.statusCode, {
      errorId: errorId,
    });
  }

  if (err.isOperational) {
    const errorId = await saveError(err);
    return fail(res, "Something went wrong!", err.statusCode, {
      msg: err.message,
      errodId: errorId,
    });
  }

  logger.error("ERROR 💥", err);
  const errorId = await saveError(err);
  return fail(res, "Something went wrong!", err.statusCode, {
    msg: err.message,
    errodId: errorId,
  });
};

// Define custom error handling middleware
async function handleKnexError(err: any, req: any, res: any) {
  // Check if the error is from Knex
  if (err instanceof DBError) {
    // Log the error for debugging purposes
    dbLogger.error("Knex Error:" + err);

    // Respond to the client with an appropriate error message
    logger.critical("ERROR 💥", err);
  } else {
    // If it's not a Knex error, pass it to the default Express error handler
  }
}

/**
 * Global error handler middleware.
 * @param err The error object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.APP_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.APP_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;

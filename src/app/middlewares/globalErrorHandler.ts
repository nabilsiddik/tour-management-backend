import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../errorHelpers/appError";
import { TErrorSources } from "../interfaces/errors.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
dotenv.config();


export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorSources: TErrorSources[] = [];
  let errorStatusCode = 500;
  let errorMessage = `Something went wrong.`;

  // Conditionaly Handle Duplicate Error
  if (error.code === 11000) {
    const duplicateError = handleDuplicateError(error)
    errorStatusCode = duplicateError.errorStatusCode
    errorMessage = duplicateError.errorMessage
  } 
  
  // Conditionaly Handle Cast Error
  else if (error.name === "CastError") {
    const castError = handleCastError(error)
    errorStatusCode = castError.errorStatusCode
    errorMessage = castError.errorMessage
  } 

  // Conditionaly Handle Zod Error
  else if(error.name === 'ZodError'){
    const zodError = handleZodError(error, errorSources)

    errorStatusCode = zodError.errorStatusCode
    errorMessage = zodError.errorMessage
  }

  else if (error.name === "ValidationError") {
    const validationError = handleValidationError(error, errorSources)

    errorStatusCode = validationError.errorStatusCode
    errorMessage = validationError.errorMessage
  } 
  
  else if (error instanceof AppError) {
    errorStatusCode = error.statusCode;
    errorMessage = error.message;
  } else if (error instanceof Error) {
    (errorStatusCode = 500), (errorMessage = error.message);
  }

  res.status(errorStatusCode).json({
    success: false,
    message: errorMessage,
    error: {
      name: error.name,
      message: error.message,
      errorSources,
      issues: error.issues,
    },
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
};

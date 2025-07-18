import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import dotenv from "dotenv";
import AppError from "../errorHelpers/appError";
import mongoose from "mongoose";
dotenv.config();


// Simplified error handling functions
// Handle Duplicate Error function
const  handleDuplicateError = (error: any) => {
    const duplicate = error.message.match(/"([^"]*)"/)
    return {
        errorStatusCode : 400,
        errorMessage : `${duplicate[1]} already exist`
    }
}

// Handle Cast Error function
const handleCastError = (error: mongoose.CastError) => {
    console.log(error)
    return {
        errorStatusCode : 400, 
        errorMessage : "Invalid object id"
    }
}

// Handle Zod Error function
const handleZodError = (error: any, errorSources: any) => {
    console.log(error)

    error.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    })

    return {
        errorStatusCode : 400,
        errorMessage : "Zod Error",
    }
}



export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorSources: any = [];
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
    errorStatusCode = 400;
    const errors = Object.values(error.errors);
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    errorMessage = "validation Error";
  } else if (error instanceof AppError) {
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

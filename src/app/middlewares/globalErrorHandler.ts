import { NextFunction, Request, Response } from "express"
import statusCode from 'http-status-codes'
import dotenv from 'dotenv'
import AppError from "../errorHelpers/appError"
dotenv.config()

export const globalErrorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {

    let errorStatusCode = 500
    let errorMessage = `Something went wrong.`

    if(error instanceof AppError){
        errorStatusCode = error.statusCode
        errorMessage = error.message
    }else if(error instanceof Error){
        errorStatusCode = 500,
        errorMessage = error.message
    }

    res.status(errorStatusCode).json({
        success: false,
        message: errorMessage,
        error: error,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })
})
import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { userServices } from "./user.services";
import { sendResponse } from "../../utils/userResponse";
// import AppError from "../../errorHelpers/appError";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err: any)=>{
    console.log(err)
    next(err)
  })
}

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const user = await userServices.createUser(req.body);

    // res.status(statusCode.CREATED).json({
    //   success: true,
    //   message: "User created successfully.",
    //   data: user,
    // });

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'User Created Successfully',
      data: user
    })
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUsers()

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'All User Retrived Successfully',
      data: result.data,
      meta: result.meta
    })
})

export const userControllers = {
  createUser,
  getAllUsers,
};

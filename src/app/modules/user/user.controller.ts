import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { userServices } from "./user.services";
import { sendResponse } from "../../utils/userResponse";
// import AppError from "../../errorHelpers/appError";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err: any)=>{
    console.log(err)
    next(err)
  })
}

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const user = await userServices.createUser(req.body);

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

const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const updatedUser = await userServices.updateUser(req.body);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: 'User Updated Successfully',
      data: updatedUser
    })
})


export const userControllers = {
  createUser,
  getAllUsers,
  updateUser
};

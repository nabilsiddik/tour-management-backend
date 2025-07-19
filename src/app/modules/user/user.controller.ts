import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import { userServices } from "./user.services";
import { sendResponse } from "../../utils/userResponse";
import { envVars } from "../../config/env";
import { JwtPayload, verify } from "jsonwebtoken";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err: any)=>{
    if(envVars.NODE_ENV === 'development'){
        console.log(err)
      }
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

  const userId = req.params.id
  const payload = req.body

  const token = req.headers.authorization
  const verifiedToken = verify(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

  const updatedUser = await userServices.updateUser(userId, payload, verifiedToken);

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

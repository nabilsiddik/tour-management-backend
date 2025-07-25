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

// Create an user
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const user = await userServices.createUser(req.body);

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'User Created Successfully',
      data: user
    })
})

// Get all users
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


// Get single User
const getSingleUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const user = await userServices.getSingleUser(userId)

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'Single User retrive successfully',
      data: user
    })
})



// Get me
const getMe = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const user = await userServices.getMe(decodedToken)

    sendResponse(res, {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'Current User retrive successfully',
      data: user
    })
})

// Update user
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
  updateUser,
  getMe,
  getSingleUser
};

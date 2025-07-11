import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/userResponse";
import statusCodes from "http-status-codes";
import { catchAsync } from "../user/user.controller";
import { authServices } from "./auth.service";

const credentialLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const loginInfo = await authServices.credentialLogin(req.body)

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: 'User credential login successfull',
      data: loginInfo
    })
})

export const authControllers = {
    credentialLogin
}
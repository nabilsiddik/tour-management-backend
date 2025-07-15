import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/userResponse";
import statusCodes from "http-status-codes";
import { catchAsync } from "../user/user.controller";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialLogin(req.body);

    // Set Access Token or Refresh Token
    setAuthCookie(res, loginInfo)

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "User credential login successfull",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        statusCodes.BAD_GATEWAY,
        "No refresh token received from cookies."
      );
    }

    const tokenInfo = await authServices.getNewAccessToken(refreshToken);

    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false
    })

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "New Access token created successfull",
      data: tokenInfo,
    });
  }
);

const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    throw new AppError(statusCodes.NOT_FOUND, "User not found");
  }

  const tokenInfo = createUserTokens(user);
  // const callback = await
};

export const authControllers = {
  credentialLogin,
  getNewAccessToken,
  googleCallback,
};

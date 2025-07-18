import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/userResponse";
import statusCodes from "http-status-codes";
import { catchAsync } from "../user/user.controller";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialLogin(req.body);
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(401, error))
      }

      if (!user) {
        return next(new AppError(401, info.message))
      }

      const userTokens = await createUserTokens(user)

      // delete user.toObject().password
      const { password: pass, ...rest } = user.toObject();

      // Set Access Token or Refresh Token
      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: statusCodes.OK,
        success: true,
        message: "User credential login successfull",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest
        },
      });
    })(req, res, next);
  }
);

// Logout
const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "User loged out successfull",
      data: null,
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
      secure: false,
    });
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "New Access token created successfull",
      data: tokenInfo,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    console.log("dec token from controller", decodedToken);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const resetPassword = await authServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Password Reseted Successfully",
      data: resetPassword,
    });
  }
);

const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }

  const user = req.user;

  if (!user) {
    throw new AppError(statusCodes.NOT_FOUND, "User not found");
  }

  const tokenInfo = await createUserTokens(user);
  setAuthCookie(res, tokenInfo);

  res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`);
};

export const authControllers = {
  credentialLogin,
  getNewAccessToken,
  googleCallback,
  logOut,
  resetPassword,
};

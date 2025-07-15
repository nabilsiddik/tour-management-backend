import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import User from "../modules/user/user.model";
import AppError from "../errorHelpers/appError";
import statusCodes from 'http-status-codes';

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken
  }
};


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const existingUser = await User.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!existingUser) {
    throw new AppError(statusCodes.BAD_REQUEST, "User does not exist");
  }

  if (
    existingUser.isActive === IsActive.BLOCKED ||
    existingUser.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      statusCodes.BAD_REQUEST,
      `User is ${existingUser.isActive}`
    );
  }

  if (existingUser.isDeleted) {
    throw new AppError(statusCodes.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: existingUser._id,
    email: existingUser.email,
    role: existingUser.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken
};
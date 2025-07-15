import AppError from "../../errorHelpers/appError";
import { IsActive, IUser } from "../user/user.interface";
import User from "../user/user.model";
import statusCodes from "http-status-codes";
import bycryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(statusCodes.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatchd = await bycryptjs.compare(
    password as string,
    existingUser.password as string
  );

  if (!isPasswordMatchd) {
    throw new AppError(statusCodes.BAD_REQUEST, "Password is not valid");
  }

  const userTokens = createUserTokens(existingUser);

  const { password: pass, ...rest } = existingUser.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// Get new Access Token using verified Refresh token
const getNewAccessToken = async(refreshToken: string) => {
  const getNewAccessToken = createNewAccessTokenWithRefreshToken(refreshToken)
  return {
    accessToken: getNewAccessToken
  }
}

export const authServices = {
  credentialLogin,
  getNewAccessToken,
};

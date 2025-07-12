import AppError from "../../errorHelpers/appError"
import { IUser } from "../user/user.interface"
import User from "../user/user.model"
import statusCodes from 'http-status-codes'
import bycryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialLogin = async(payload: Partial<IUser>) => {
  const {email, password} = payload

  const existingUser = await User.findOne({email})

  if(!existingUser) {
    throw new AppError(statusCodes.BAD_REQUEST,'Email does not exist')
  }

  const isPasswordMatchd = await bycryptjs.compare(password as string, existingUser.password as string)

  if(!isPasswordMatchd){
    throw new AppError(statusCodes.BAD_REQUEST, 'Password is not valid')
  }

  const jwtPayload = {
    userId: existingUser._id,
    email: existingUser.email,
    role: existingUser.role,
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

  const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)

  return {
    accessToken
  }
}

export const authServices = {
    credentialLogin
}
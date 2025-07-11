import AppError from "../../errorHelpers/appError"
import { IUser } from "../user/user.interface"
import User from "../user/user.model"
import statusCodes from 'http-status-codes'
import bycryptjs from 'bcryptjs';

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

  return {
    email: existingUser.email
  }
}

export const authServices = {
    credentialLogin
}
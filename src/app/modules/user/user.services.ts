import { StatusCodes } from "http-status-codes";
import { IAuthProvider, IUser } from "./user.interface";
import User from "./user.model";
import AppError from "../../errorHelpers/appError";
import bycryptjs from 'bcryptjs'

// Create user
const createUser = async(payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
      throw new AppError(StatusCodes.BAD_REQUEST, 'User already exist.')
    }

    const hashedPassword = await bycryptjs.hash(password as string, 10)

    const authProvider : IAuthProvider = {
      provider: 'credentials',
      providerId: email as string
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      auths: [authProvider],
      ...rest
    });

    return user
}

// Get all users
const getAllUsers = async() => {
  const users = await User.find({})
  const totalUsers = await User.countDocuments()
  return {
    data: users,
    meta: {
      total: totalUsers
    }
  }
}

// Update user
const updateUser = async(payload: Partial<IUser>) => {
  const updatedData = payload
  const {email} = payload
  const updateUser = User.findByIdAndUpdate(email, updatedData)

  return {
    data: updateUser
  }
}


export const userServices = {
    createUser,
    getAllUsers,
    updateUser
}
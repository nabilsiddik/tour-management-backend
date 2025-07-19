import { StatusCodes } from "http-status-codes";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import User from "./user.model";
import AppError from "../../errorHelpers/appError";
import bycrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import statusCodes from "http-status-codes";
import { envVars } from "../../config/env";

// Create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exist.");
  }

  const hashedPassword = await bycrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// Get all users
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// Update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new AppError(statusCodes.NOT_FOUND, "User not found");
  }

  if (userExist.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(
      statusCodes.FORBIDDEN,
      "Admins cannot change super admin roles"
    );
  }

  if (
    decodedToken.role === Role.ADMIN &&
    userId === decodedToken._id &&
    payload.role &&
    payload.role !== Role.ADMIN
  ) {
    throw new AppError(
      statusCodes.FORBIDDEN,
      "Admins cannot change their own role"
    );
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(statusCodes.FORBIDDEN, "Your are not permited");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(statusCodes.FORBIDDEN, "Your are not permited");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(statusCodes.FORBIDDEN, "Your are not permited");
    }
  }

  if (payload.password) {
    payload.password = await bycrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const userServices = {
  createUser,
  getAllUsers,
  updateUser,
};

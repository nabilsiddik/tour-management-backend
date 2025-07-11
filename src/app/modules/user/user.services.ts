import { IUser } from "./user.interface";
import User from "./user.model";

// Create user
const createUser = async(payload: Partial<IUser>) => {
    const { name, email } = payload;

    const user = await User.create({
      name,
      email,
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


export const userServices = {
    createUser,
    getAllUsers
}
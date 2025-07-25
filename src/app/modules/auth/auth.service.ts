import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import User from "../user/user.model";
import statusCodes from "http-status-codes";
import bycryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import bcrypt from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../utils/sendEmaill";

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
const getNewAccessToken = async (refreshToken: string) => {
  const getNewAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
  return {
    accessToken: getNewAccessToken
  }
}


// Reset password
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
  if(payload.id != decodedToken.userId){
    throw new AppError(401, 'You can not reset your password')
  }

  const isUserExist = await User.findById(decodedToken.userId)

  if(!isUserExist){
    throw new AppError(401, 'User does not exist while reset password')
  }

   // Hash the newly seted plain password
  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  isUserExist.password = hashedPassword
  await isUserExist.save()

}


// Forgot password
const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email })

  if (!isUserExist) {
    throw new AppError(statusCodes.BAD_REQUEST, 'User does not exist while forgot password')
  }

  // Throw error if user is not verified
  if (!isUserExist.isVerified) {
    throw new AppError(statusCodes.BAD_REQUEST, "User is not verified");
  }

  // Throw error if user is blocked or inactive
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      statusCodes.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  // Throw error if user is deleted
  if (isUserExist.isDeleted) {
    throw new AppError(statusCodes.BAD_REQUEST, "User is deleted");
  }


  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: '10m'
  })

  const resetUILink = `${envVars.FRONT_END_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

  sendEmail({
    to: isUserExist.email,
    subject: 'Password reset',
    templateName: 'forgetPassword',
    templateData: {
      name: isUserExist.name,
      resetUILink,
    }
  })

}



// Change Password
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  if (!decodedToken || !decodedToken.userId) {
    throw new AppError(statusCodes.UNAUTHORIZED, 'Invalid token. User ID not found.')
  }

  const user = await User.findById(decodedToken.userId)

  if (!user) {
    throw new AppError(statusCodes.NOT_FOUND, 'User not found.')
  }

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user?.password as string)

  if (!isOldPasswordMatch) {
    throw new AppError(statusCodes.UNAUTHORIZED, "Old password does not match.")
  }

  user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  user!.save()

  return true
}



// Set password
const setPassword = async (userId: string, plainPassword: string) => {

  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(statusCodes.NOT_FOUND, 'User not found.')
  }

  if (user.password && user.auths?.some(auth => auth.provider === 'google')) {
    throw new AppError(statusCodes.BAD_REQUEST, 'You have already set your password. Now you can change the passwrod from your profile password update.')
  }

  // Hash the newly seted plain password
  const hashedPassword = await bcrypt.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))

  const credentialProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: user.email
  }

  const auths: IAuthProvider[] = [...(user.auths || []), credentialProvider]
  user.password = hashedPassword
  user.auths = auths

  await user.save()


  return true
}



export const authServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword
};

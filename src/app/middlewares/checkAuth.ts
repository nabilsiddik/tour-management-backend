import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/env";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import User from "../modules/user/user.model";
import statusCodes from 'http-status-codes';
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.headers.authorization;

        // Throw error if access token not found
        if (!accessToken) {
          throw new AppError(403, "Access Token not found");
        }

        const verifiedToken = jwt.verify(
          accessToken,
          envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const existingUser = await User.findOne({
          email: verifiedToken.email,
        });

        // Throw error if not existing user
        if (!existingUser) {
          throw new AppError(statusCodes.BAD_REQUEST, "User does not exist");
        }

        // Throw error if user is not verified
        if (!existingUser.isVerified) {
          throw new AppError(statusCodes.BAD_REQUEST, "User is not verified");
        }

        // Throw error if user is blocked or inactive
        if (
          existingUser.isActive === IsActive.BLOCKED ||
          existingUser.isActive === IsActive.INACTIVE
        ) {
          throw new AppError(
            statusCodes.BAD_REQUEST,
            `User is ${existingUser.isActive}`
          );
        }

        // Throw error if user is deleted
        if (existingUser.isDeleted) {
          throw new AppError(statusCodes.BAD_REQUEST, "User is deleted");
        }


        // Throw error if user is not permited to the route
        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(403, "You are not permited to access this route.");
        }

        req.user = verifiedToken

        next();
      } catch (error: any) {
        next(error);
      }
    };

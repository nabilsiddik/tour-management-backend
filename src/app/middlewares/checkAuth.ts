import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/env";
import jwt from 'jsonwebtoken'
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "Access Token not found");
      }

      const verifiedToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

      console.log(verifiedToken);
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permited to access this route.");
      }

      next();
    } catch (error: any) {
      next(error);
    }
  }
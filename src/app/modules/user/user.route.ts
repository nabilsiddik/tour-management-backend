import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verify } from "./../../../../node_modules/@types/jsonwebtoken/index.d";
import { Role } from "./user.interface";

const userRouter = express.Router();

// hire order function
const checkAuth = (...rest: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "Access Token not found");
      }

      const verifiedToken = jwt.verify(accessToken, "secret");

      console.log(verifiedToken);
      if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(403, "You are not permited to access this route.");
      }

      next();
    } catch (error: any) {
      next(error);
    }
  }

userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
userRouter.put(
  "/:id",
  validateRequest(updateUserZodSchema),
  userControllers.updateUser
);
userRouter.get(
  "/all-user",
  checkAuth('ADMIN', 'SUPER_ADMIN'),
  userControllers.getAllUsers
);

export default userRouter;

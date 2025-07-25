import express from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRouter = express.Router();

// User Registration
userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
)

// Get all users
userRouter.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
)

// Get self information
userRouter.get(
  "/me",
  checkAuth(...Object.values(Role)),
  userControllers.getMe
)

// Get single user
userRouter.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.getSingleUser
)

// Update user
userRouter.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.updateUser
)

export default userRouter;

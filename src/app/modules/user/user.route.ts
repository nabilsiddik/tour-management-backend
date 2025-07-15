import express from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
userRouter.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
userRouter.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.updateUser
)

export default userRouter;

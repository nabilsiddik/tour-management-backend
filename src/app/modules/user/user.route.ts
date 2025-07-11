import express from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const userRouter = express.Router();

userRouter.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
userRouter.put('/:id', validateRequest(updateUserZodSchema), userControllers.updateUser)
userRouter.get("/", userControllers.getAllUsers);

export default userRouter;

import express from 'express'
import { userControllers } from './user.controller'

const userRouter = express.Router()

userRouter.post('/register', userControllers.createUser)
userRouter.get('/', userControllers.getAllUsers)

export default userRouter

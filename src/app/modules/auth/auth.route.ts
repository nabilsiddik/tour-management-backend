import { Router } from 'express';
import { authControllers } from './auth.controller';

const authRouter = Router()

authRouter.post('/login', authControllers.credentialLogin)

export default authRouter 
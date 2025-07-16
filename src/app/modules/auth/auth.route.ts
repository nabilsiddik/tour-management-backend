import { NextFunction, Request, Response, Router } from 'express';
import { authControllers } from './auth.controller';
import passport from 'passport';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const authRouter = Router()

authRouter.post('/login', authControllers.credentialLogin)
authRouter.post('/logout', authControllers.logOut)
authRouter.post('/refresh-token', authControllers.getNewAccessToken)
authRouter.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword)
// authRouter.get('/google', async(req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate('google', {scope: ["profile", "email"]})(req, res)
// })
// authRouter.get('/google/callback', authControllers.googleCallback)

export default authRouter 
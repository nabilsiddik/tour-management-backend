import { NextFunction, Request, Response, Router } from 'express';
import { authControllers } from './auth.controller';
import passport from 'passport';

const authRouter = Router()

authRouter.post('/login', authControllers.credentialLogin)
authRouter.post('/refresh-token', authControllers.getNewAccessToken)
// authRouter.get('/google', async(req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate('google', {scope: ["profile", "email"]})(req, res)
// })
// authRouter.get('/google/callback', authControllers.googleCallback)

export default authRouter 
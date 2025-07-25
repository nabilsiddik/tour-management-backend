import { NextFunction, Request, Response, Router } from 'express';
import { authControllers } from './auth.controller';
import passport from 'passport';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const authRouter = Router()

authRouter.post('/login', authControllers.credentialLogin)
authRouter.post('/logout', authControllers.logOut)
authRouter.post('/refresh-token', authControllers.getNewAccessToken)
authRouter.post('/change-password', checkAuth(...Object.values(Role)), authControllers.changePassword)
authRouter.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword)

authRouter.post('/set-password', checkAuth(...Object.values(Role)), authControllers.setPassword)

authRouter.get('/google', async(req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || ""
    passport.authenticate('google', {scope: ["profile", "email"], state: redirect as string})(req, res, next)
})
authRouter.get('/google/callback', passport.authenticate("google", {failureRedirect: '/login'}), authControllers.googleCallback)

export default authRouter 
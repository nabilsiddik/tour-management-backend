import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from 'cors'
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
// import passport from "passport";
import expressSession from "express-session"
import cookieParser from "cookie-parser";

app.use(express.json())
app.use(cors())
app.use(cookieParser())
// app.use(passport.initialize())
// app.use(passport.session())
app.use(expressSession({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false
}))

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running...')
})

app.use(globalErrorHandler)

app.use(notFound)

export default app
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from 'cors'
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import statusCode from 'http-status-codes';
import { notFound } from "./app/middlewares/notFound";

app.use(express.json())
app.use(cors())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running...')
})

app.use(globalErrorHandler)

app.use(notFound)

export default app
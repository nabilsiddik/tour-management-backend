import { Request, Response } from "express";
import { catchAsync } from "../user/user.controller";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../config/env";

// Success payment controller
const successPayment = catchAsync(async(req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentServices.successPayment(query as Record<string, string>)

    if(result.success){
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

// Failed Payment Controller
const failedPayment = catchAsync(async(req: Request, res: Response) => {
    
})

// Cancled payment controller
const cancledPaymetn = catchAsync(async(req: Request, res: Response) => {
    
})

export const PaymentControllers = {
    successPayment,
    failedPayment,
    cancledPaymetn
}
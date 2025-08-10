import { Request, Response } from "express";
import { catchAsync } from "../user/user.controller";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/userResponse";


// Init payment
const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId
    const result = await PaymentServices.initPayment(bookingId)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
})


// Success payment controller
const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentServices.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

// Failed Payment Controller
const failedPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentServices.failedPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

// Cancled payment controller
const cancledPaymetn = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentServices.cancledPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCLE_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})


// Get Payment invoice download url
const getInvoiceDownloadUrl = catchAsync(async (req: Request, res: Response) => {
    const {paymentId} = req.params
    const result = await PaymentServices.getInvoiceDownloadUrl(paymentId)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment invoice download url retrive successfull.",
        data: result,
    });
})

export const PaymentControllers = {
    successPayment,
    failedPayment,
    cancledPaymetn,
    initPayment,
    getInvoiceDownloadUrl
}
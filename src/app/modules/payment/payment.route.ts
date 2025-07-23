import express from 'express'
import { PaymentControllers } from './payment.controllers'

const paymentRouter = express.Router()

paymentRouter.post('/success', PaymentControllers.successPayment)
paymentRouter.post('/fail', PaymentControllers.failedPayment)
paymentRouter.post('/cancle', PaymentControllers.cancledPaymetn)
paymentRouter.post('/init-payment/:bookingId', PaymentControllers.initPayment)

export default paymentRouter
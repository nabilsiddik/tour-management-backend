import express from 'express'
import { PaymentControllers } from './payment.controllers'

const paymentRouter = express.Router()

paymentRouter.post('/success', PaymentControllers.successPayment)
paymentRouter.post('/fail', PaymentControllers.failedPayment)
paymentRouter.post('/cancle', PaymentControllers.cancledPaymetn)

export default paymentRouter
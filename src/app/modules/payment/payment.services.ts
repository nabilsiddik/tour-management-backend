import { Request } from "express"
import Booking from "../booking/booking.model"
import Payment from "./payment.model"
import { IPayment, PAYPMENT_STATUS } from "./payment.interface"
import { BOOKING_STATUS } from "../booking/booking.interface"
import AppError from "../../errorHelpers/appError"
import { StatusCodes } from "http-status-codes"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"


// Init payment business logics
const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Payment not found. You have not booked this tour.')
    }

    const booking = await Booking.findById(payment.booking)

    // Initialize SSL Payment
    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userName = (booking?.user as any).name
    const userPhone = (booking?.user as any).phone

    const sslPayload: ISSLCommerz = {
        name: userName,
        email: userEmail,
        address: userAddress,
        phone: userPhone,
        amount: payment.amount,
        transactionId: payment.transactionId
    }


    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

}

// Success payment business logics Implementing roolback transaction
const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    // Update payment status to Paid after successfull transaction
    const transactionId = query.transactionId
    const updatedPayment = await Payment.findOneAndUpdate({ transactionId }, {
        status: PAYPMENT_STATUS.PAID
    }, { session })

    // Update Booking status to Confirmed
    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
        status: BOOKING_STATUS.COMPLETED
    }, { session })

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return {
        success: true,
        message: 'Payment completed successfully'
    }
}



// Failed payment business logics
const failedPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    // Update payment status to failed after failed payment
    const transactionId = query.transactionId
    const updatedPayment = await Payment.findOneAndUpdate({ transactionId }, {
        status: PAYPMENT_STATUS.FAILED
    }, { session })

    // Update Booking status to failed
    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
        status: BOOKING_STATUS.FAILED
    }, { session })

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return {
        success: false,
        message: 'Payment failed'
    }
}




// Cancled payment business logics
const cancledPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    // Update payment status to cancled after cancling transaction
    const transactionId = query.transactionId
    const updatedPayment = await Payment.findOneAndUpdate({ transactionId }, {
        status: PAYPMENT_STATUS.CANCLED
    }, { session })

    // Update Booking status to cancled
    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
        status: BOOKING_STATUS.CANCLED
    }, { session })
        .populate('user', 'name email phone address')
        .populate('tour', 'title costfrom')
        .populate('payment')

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return {
        success: false,
        message: 'Payment cancled'
    }
}


export const PaymentServices = {
    successPayment,
    failedPayment,
    cancledPayment,
    initPayment
}
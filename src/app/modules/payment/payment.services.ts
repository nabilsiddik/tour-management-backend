import { Request } from "express"
import Booking from "../booking/booking.model"
import Payment from "./payment.model"
import { IPayment, PAYPMENT_STATUS } from "./payment.interface"
import { BOOKING_STATUS } from "../booking/booking.interface"

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
        .populate('user', 'name email phone address')
        .populate('tour', 'title costfrom')
        .populate('payment')

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return {
        success: true,
        message: 'Payment completed successfully'
    }
}

// Failed payment business logics
const failedPayment = async () => {
    // Update booking status to failed

    // Update paypment status to Paid
}


// Cancled payment business logics
const cancledPayment = async () => {
    // Update booking status to cancled

    // Update paypment status to cancled
}


export const PaymentServices = {
    successPayment,
    failedPayment,
    cancledPayment
}
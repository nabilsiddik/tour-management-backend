import { StatusCodes } from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import User from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import Booking from "./booking.model"
import Payment from "../payment/payment.model"
import { PAYPMENT_STATUS } from "../payment/payment.interface"
import { Tour } from "../tour/tour.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { getTransactionId } from "../../utils/getTransactionId"



const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    // Generate transaction id
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        // if users phone or address not available
        const user = await User.findById(userId)
        if (!user?.phone || !user?.address) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Please update your profile to Book a Tour')
        }

        const tour = await Tour.findById(payload.tour).select('costFrom')

        // if costFrom not available
        if (!tour?.costFrom) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'No Tour Cost Found')
        }

        // Calculate tour amount
        const amount = Number(tour.costFrom) * Number(payload.guestCount)

        // Create Booking
        const booking = await Booking.create([
            {
                user: userId,
                status: BOOKING_STATUS.PENDING,
                ...payload
            }
        ], { session })

        // Create Payment
        const payment = await Payment.create([
            {
                booking: booking[0]._id,
                status: PAYPMENT_STATUS.UNPAID,
                transactionId,
                amount
            }
        ], { session })

        // Update payment inside booking after payment created
        const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate('user', 'name email phone address')
            .populate('tour', 'title costfrom')
            .populate('payment')

        // Initialize SSL Payment
        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userName = (updatedBooking?.user as any).name
        const userPhone = (updatedBooking?.user as any).phone

        const sslPayload: ISSLCommerz = {
            name: userName,
            email: userEmail,
            address: userAddress,
            phone: userPhone,
            amount,
            transactionId
        }

        console.log(sslPayload)

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)
        // console.log(sslPayment)

        // Commit transaction if everything ok
        await session.commitTransaction()
        session.endSession()
        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL
        }

    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }



}

export const BookingServices = {
    createBooking
}
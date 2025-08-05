import { Types } from "mongoose";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { IPayment } from "../payment/payment.interface";

export enum BOOKING_STATUS {
    PENDING = 'PENDING',
    CANCLED = 'CANCLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface IBooking{
    user: Types.ObjectId,
    tour: Types.ObjectId,
    payment?: Types.ObjectId,
    guestCount: number,
    status: BOOKING_STATUS,
    createdAt: Date
}
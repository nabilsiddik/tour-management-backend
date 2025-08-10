import { Types } from "mongoose";

export enum PAYPMENT_STATUS{
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    FAILED = 'FAILED',
    CANCLED = 'CANCLED',
    REFUNDED = 'REFUNDED'
}

export interface IPayment{
    booking: Types.ObjectId,
    transactionId: string,
    amount: number,
    paymentGetway?: any,
    invoiceUrl?: string,
    status: PAYPMENT_STATUS
}
import { model, Schema } from "mongoose";
import { IPayment, PAYPMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(PAYPMENT_STATUS),
        default: PAYPMENT_STATUS.UNPAID
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentGetway: {type: Schema.Types.Mixed},
    invoice: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})

const Payment = model<IPayment>("Payment", paymentSchema)

export default Payment
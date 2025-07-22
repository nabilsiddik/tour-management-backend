import z from "zod";
import { BOOKING_STATUS } from "./booking.interface";

export const createBookingSchema = z.object({
    tour: z.string(),
    guestCount: z.number().int().positive()
})

export const updateBookingSchema = z.object({
    status: z.enum(Object.values(BOOKING_STATUS) as [string])
})
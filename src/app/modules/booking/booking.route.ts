import express from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { createBookingSchema, updateBookingSchema } from "./booking.validation";
import { BookingControllers } from "./booking.controllers";

const bookingRouter = express.Router();

// api/v1/booking
bookingRouter.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingSchema),
    BookingControllers.createBooking
);

// // api/v1/booking
// bookingRouter.get("/",
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     BookingControllers.getAllBookings
// );

// // api/v1/booking/my-bookings
// bookingRouter.get("/my-bookings",
//     checkAuth(...Object.values(Role)),
//     BookingControllers.getUserBookings
// );

// // api/v1/booking/bookingId
// bookingRouter.get("/:bookingId",
//     checkAuth(...Object.values(Role)),
//     BookingControllers.getSingleBooking
// );

// // api/v1/booking/bookingId/status
// bookingRouter.patch("/:bookingId/status",
//     checkAuth(...Object.values(Role)),
//     validateRequest(updateBookingSchema),
//     BookingControllers.updateBookingStatus
// );

export default bookingRouter
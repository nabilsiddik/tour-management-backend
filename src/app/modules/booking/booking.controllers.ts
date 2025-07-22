import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/userResponse";
import { catchAsync } from "../user/user.controller";
import { BookingServices } from "./booking.services";


const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload
    const booking = await BookingServices.createBooking(req.body, decodeToken.userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

// const getUserBookings = catchAsync(
//     async (req: Request, res: Response) => {
//         const bookings = await BookingServices.getUserBookings();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Bookings retrieved successfully",
//             data: bookings,
//         });
//     }
// );
// const getSingleBooking = catchAsync(
//     async (req: Request, res: Response) => {
//         const booking = await BookingServices.getBookingById();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Booking retrieved successfully",
//             data: booking,
//         });
//     }
// );

// const getAllBookings = catchAsync(
//     async (req: Request, res: Response) => {
//         const bookings = await BookingServices.getAllBookings();
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Bookings retrieved successfully",
//             data: {},
//         });
//     }
// );

// const updateBookingStatus = catchAsync(
//     async (req: Request, res: Response) => {

//         const updated = await BookingServices.updateBookingStatus(
//         );
//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Booking Status Updated Successfully",
//             data: updated,
//         });
//     }
// );


export const BookingControllers = {
    createBooking,
    // getAllBookings,
    // getSingleBooking,
    // getUserBookings,
    // updateBookingStatus,
}
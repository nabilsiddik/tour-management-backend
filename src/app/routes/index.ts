import { Router } from "express";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/auth/auth.route";
import tourRouter from "../modules/tour/tour.route";
import divisionRouter from "../modules/division/division.route";
import bookingRouter from "../modules/booking/booking.route";
import paymentRouter from "../modules/payment/payment.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/tour',
        route: tourRouter
    },
    {
        path: '/division',
        route: divisionRouter
    },
    {
        path: '/booking',
        route: bookingRouter
    },
    {
        path: '/payment',
        route: paymentRouter
    }
]

moduleRoutes.forEach((route) => 
    router.use(route.path, route.route)
)


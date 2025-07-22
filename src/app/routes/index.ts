import { Router } from "express";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/auth/auth.route";
import tourRouter from "../modules/tour/tour.route";
import divisionRouter from "../modules/division/division.route";

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
    }
]

moduleRoutes.forEach((route) => 
    router.use(route.path, route.route)
)


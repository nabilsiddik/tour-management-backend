import express from 'express'
import { checkAuth } from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import { validateRequest } from '../../middlewares/validateRequest'
import { createTourZodSchema, updateTourZodSchema } from './rout.validation'
import { tourControllers } from './tour.controller'

const tourRouter = express.Router()

// Route to create a tour
tourRouter.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourZodSchema),
    tourControllers.createTour
)

// Route to get all the tours
tourRouter.get('/',
    // checkAuth(...Object.values(Role)), 
    tourControllers.getAllTours
)


// Route to update a tour
tourRouter.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    tourControllers.updateTour
);

// Route to delete a tour
tourRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTour);

export default tourRouter

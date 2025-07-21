import express from 'express'
import { checkAuth } from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import { validateRequest } from '../../middlewares/validateRequest'
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from './rout.validation'
import { tourControllers } from './tour.controller'

const tourRouter = express.Router()
/* ------------------ TOUR TYPE ROUTES -------------------- */
tourRouter.get("/tour-types", tourControllers.getAllTourTypes);

tourRouter.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    tourControllers.createTourType
);

tourRouter.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    tourControllers.updateTourType
);

tourRouter.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTourType);



/* ------- Routers for Tour ----- */
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

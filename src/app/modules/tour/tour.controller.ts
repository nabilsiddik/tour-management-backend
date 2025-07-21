import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../user/user.controller";
import { tourServices } from "./tour.services";
import { sendResponse } from "../../utils/userResponse";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

/* ------ All the controllers for Tour ------ */
// Controller for Create a tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Business logics of tour creation from tourServices
    const tourData = await tourServices.createTour(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour created successfully",
      data: tourData,
    });
  }
);

// Controller for Get all tour
const getAllTours = catchAsync(async (req: Request, res: Response) => {
// Business logics of getting all tours from tourServices
  const toursData = await tourServices.getAllTours();

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tours retrieved successfully",
    data: toursData,
  });
});


// Controller for update a tour
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body

  // Business logics of update tour from tourServices
  const updatedTour = await tourServices.updateTour(id, payload)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tours updated successfully",
    data: updatedTour,
  });
});


// Controller for delete a tour
const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await tourServices.deleteTour(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
});





/* ---- All the controllers for tour types ----- */
// Controller got get all the tour types
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await tourServices.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});


// Controller to create a tour types
const createTourType = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await tourServices.createTourType(name);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

// Controller to update a tour types
const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await tourServices.updateTourType(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});


// Controller to delete a tour types
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await tourServices.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});

export const tourControllers = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType
};

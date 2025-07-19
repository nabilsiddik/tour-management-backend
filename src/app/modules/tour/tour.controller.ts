import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../user/user.controller";
import { tourServices } from "./tour.services";
import { sendResponse } from "../../utils/userResponse";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

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

export const tourControllers = {
  createTour,
  getAllTours,
  updateTour
};

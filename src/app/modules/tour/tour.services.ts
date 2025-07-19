import AppError from "../../errorHelpers/appError";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { StatusCodes } from "http-status-codes";

// Business logics of tour creation
const createTour = async(payload: ITour) => {
    const existingTour = await Tour.findOne({title: payload.title})

    if(existingTour){
        throw new AppError(StatusCodes.BAD_REQUEST, 'A tour with this title already exists.')
    }

    const tour = await Tour.create(payload)

    return tour
}


// Business logics of getting all the tours
const getAllTours = async () => {
    const tours = await Tour.find()
    return tours
};


// Business logics to update tour
const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};


export const tourServices = {
    createTour,
    getAllTours,
    updateTour
}
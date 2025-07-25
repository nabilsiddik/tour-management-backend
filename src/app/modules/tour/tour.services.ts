import { promise } from "zod";
import { excludeFields } from "../../constants";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchableFields } from "./tour.constants";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { StatusCodes } from "http-status-codes";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

/* -------- All the business logics for tour --------- */
// Business logics of tour creation
const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title })

    if (existingTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'A tour with this title already exists.')
    }

    const tour = await Tour.create(payload)
    return tour
}


// Business logics of getting all the tours
const getAllTours = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours = await queryBuilder.search(tourSearchableFields).filter().sort().fields().paginate()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }

};


// Business logics to update tour
const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // Add new updated images with existing images
    if(payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0){
        payload.images = [...payload.images, ...existingTour.images]
    }

    // Update images other than the deleted images
    if(payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0){
        const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
        .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
        .filter(imageUrl => !restDBImages.includes(imageUrl))

        payload.images = [...restDBImages, ...updatedPayloadImages]
    }
    
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });


    if(payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0){
        await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
    }

    return updatedTour;
};


// Business logics to delete a tour
const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};




/* -------- All the business logics for tour types --------- */
// Business logics to create a tour type
const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create(payload);
}


// Business logics to get all tour type
const getAllTourTypes = async () => {
    return await TourType.find();
}

// Business logics to update a tour type
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
}

// Business logics to delete a tour type
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};


export const tourServices = {
    createTour,
    getAllTours,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}
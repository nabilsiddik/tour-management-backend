import { Types } from "mongoose";

// Tour Type interface
export interface ITourType{
    name: string,
}

// Tour interface
export interface ITour{
    title: string,
    slug: string,
    description?: string,
    images?: string[],
    location?: string,
    costFrom?: number,
    startDate?: Date,
    endDate?: Date,
    included?: string[],
    excluded?: string[],
    amenities?: string[],
    tourPlan?: string[],
    maxGuest?: number,
    minAge?: number,
    division: Types.ObjectId,
    tourType: Types.ObjectId
}
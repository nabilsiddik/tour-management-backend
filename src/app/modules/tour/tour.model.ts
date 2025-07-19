import { model, Schema } from "mongoose"
import { ITour, ITourType } from "./tour.interface"

// Tour type schema
const tourTypeSchema = new Schema <ITourType>({
    name: {type: String, required: true, unique: true}
}, {
    timestamps: true,
    versionKey: false
})

export const TourType = model<ITourType>("TourType", tourTypeSchema)

// Tour schema
const tourSchema = new Schema <ITour>({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    description: {type: String},
    images: {type: [String], default: []},
    location: {type: String},
    costFrom: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date},
    included: {type: [String], defalt: []},
    excluded: {type: [String], defalt: []},
    tourPlan: {type: [String], defalt: []},
    maxGuest: {type: Number},
    minAge: {type: Number},
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Tour = model<ITour>("Tour", tourSchema)
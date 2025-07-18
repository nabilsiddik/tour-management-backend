import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/errors.types"

// Handle Cast Error function
export const handleCastError = (error: mongoose.CastError): TGenericErrorResponse => {
    console.log(error)
    return {
        errorStatusCode : 400, 
        errorMessage : "Invalid object id"
    }
}

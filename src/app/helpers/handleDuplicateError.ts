import { TGenericErrorResponse } from "../interfaces/errors.types"

// Handle Duplicate Error function
export const  handleDuplicateError = (error: any): TGenericErrorResponse => {
    const duplicate = error.message.match(/"([^"]*)"/)
    return {
        errorStatusCode : 400,
        errorMessage : `${duplicate[1]} already exist`
    }
}

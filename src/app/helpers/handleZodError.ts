import { TGenericErrorResponse } from "../interfaces/errors.types"

// Handle Zod Error function
export const handleZodError = (error: any, errorSources: any): TGenericErrorResponse => {
    console.log(error)

    error.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    })

    return {
        errorStatusCode : 400,
        errorMessage : "Validation Error",
    }
}

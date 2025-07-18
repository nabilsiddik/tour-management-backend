// Handle validation error function
export const handleValidationError = (error: any, errorSources: any) => {
    const errors = Object.values(error.errors);
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );

    return {
         errorStatusCode : 400,
         errorMessage : "validation Error"
    }
}
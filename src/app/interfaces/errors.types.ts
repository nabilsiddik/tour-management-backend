export interface TErrorSources {
    path: string,
    message: string
}

export interface TGenericErrorResponse {
    errorStatusCode: number,
    errorMessage: string,
    errorSources?: TErrorSources
}
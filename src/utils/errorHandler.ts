export const handleErrorMessage = (error: unknown) => {
    let errorMessage = "An error occurred";
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
    ) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
    }
    return errorMessage;
}
export class ApiError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const badRequest = (msg = "Bad Request", details) => new ApiError(msg, 400, details);
export const unauthorized = (msg = "Unauthorized") => new ApiError(msg, 401);
export const forbidden = (msg = "Forbidden") => new ApiError(msg, 403);
export const notFound = (msg = "Not Found") => new ApiError(msg, 404);
//# sourceMappingURL=errors.js.map